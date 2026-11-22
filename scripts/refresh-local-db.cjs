// Explicitly replaces the local database using a verified Render archive.
// Restores to staging first and keeps both a dump and the previous database.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { Client } = require('../server/node_modules/pg');
const dotenv = require('../server/node_modules/dotenv');
const root = path.resolve(__dirname, '..');
process.chdir(root);
const backupDir = path.join(root, 'backups');
const env = dotenv.parse(fs.readFileSync('.env.docker'));
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const suffix = Date.now().toString();
const stage = `mak_delivery_import_${suffix}`;
const previous = `mak_delivery_previous_${suffix}`;
const localArchive = `local-before-refresh-${stamp}.dump`;
const identifier = value => '"' + value.replace(/"/g, '""') + '"';
function docker(args, capture = false) {
  const r = spawnSync('docker', args, { encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit' });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(capture ? r.stderr : `Docker failed with exit ${r.status}`);
  return r.stdout;
}
const compose = (args, capture = false) => docker(['compose', '--env-file', '.env.docker', ...args], capture);
function client(database) {
  return new Client({ host: '127.0.0.1', port: 54331, user: 'mak_delivery',
    password: env.LOCAL_DB_PASSWORD, database, ssl: false, connectionTimeoutMillis: 10000 });
}
async function tableCounts(database) {
  const db = client(database);
  await db.connect();
  try {
    const { rows } = await db.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename");
    const counts = {};
    for (const { tablename } of rows) {
      counts[tablename] = (await db.query(`SELECT count(*)::text AS n FROM public.${identifier(tablename)}`)).rows[0].n;
    }
    return counts;
  } finally { await db.end(); }
}
async function main() {
  const file = process.argv[2];
  if (!file || path.basename(file) !== file || !/^render-.*\.dump$/.test(file)) throw new Error('Pass a Render .dump filename from backups/.');
  const archive = path.join(backupDir, file);
  const metadata = JSON.parse(fs.readFileSync(`${archive}.json`, 'utf8'));
  if (crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex') !== metadata.sha256) throw new Error('Source checksum mismatch.');
  compose(['up', '-d', '--wait', 'db']);
  const admin = client('postgres');
  await admin.connect();
  let appStopped = false;
  let switched = false;
  let frozen = false;
  try {
    await admin.query(`CREATE DATABASE ${identifier(stage)} OWNER mak_delivery TEMPLATE template0`);
    compose(['cp', archive, 'db:/tmp/render-refresh.dump']);
    compose(['exec', '-T', 'db', 'pg_restore', '--exit-on-error', '--single-transaction', '--no-owner', '--no-acl', '-U', 'mak_delivery', '-d', stage, '/tmp/render-refresh.dump']);
    const after = await tableCounts(stage);
    for (const table of ['users', 'orders', 'admin_config']) if (!(table in after)) throw new Error(`Missing required table ${table}`);
    console.log('Staged archive restored successfully:', JSON.stringify(after));
    compose(['stop', 'delivery-app']);
    appStopped = true;
    const before = await tableCounts('mak_delivery');
    compose(['exec', '-T', 'db', 'pg_dump', '-U', 'mak_delivery', '-d', 'mak_delivery', '--format=custom', '--no-owner', '--no-acl', '--file=/tmp/local-before-refresh.dump']);
    compose(['cp', 'db:/tmp/local-before-refresh.dump', path.join(backupDir, localArchive)]);
    compose(['exec', '-T', 'db', 'pg_restore', '--list', '/tmp/local-before-refresh.dump'], true);
    const localBytes = fs.readFileSync(path.join(backupDir, localArchive));
    fs.writeFileSync(path.join(backupDir, `${localArchive}.json`), JSON.stringify({ createdAt: new Date().toISOString(), file: localArchive, bytes: localBytes.length, sha256: crypto.createHash('sha256').update(localBytes).digest('hex'), source: 'local Docker PostgreSQL', counts: before }, null, 2));
    await admin.query('ALTER DATABASE mak_delivery ALLOW_CONNECTIONS false');
    frozen = true;
    await admin.query("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='mak_delivery'");
    await admin.query('BEGIN');
    try {
      await admin.query(`ALTER DATABASE mak_delivery RENAME TO ${identifier(previous)}`);
      await admin.query(`ALTER DATABASE ${identifier(stage)} RENAME TO mak_delivery`);
      await admin.query('COMMIT');
      switched = true;
    } catch (error) { await admin.query('ROLLBACK'); throw error; }
    const finalCounts = await tableCounts('mak_delivery');
    if (JSON.stringify(finalCounts) !== JSON.stringify(after)) throw new Error('Counts changed during database swap.');
    fs.writeFileSync(path.join(backupDir, `refresh-${stamp}.json`), JSON.stringify({ completedAt: new Date().toISOString(), sourceArchive: file, sourceSha256: metadata.sha256, localRollbackArchive: localArchive, previousDatabase: previous, targetDatabase: 'mak_delivery', before, after: finalCounts, renderStopped: false }, null, 2));
    compose(['start', '--wait', 'delivery-app']);
    appStopped = false;
    console.log(`Refresh complete. Previous local DB retained as ${previous}. Rollback archive: ${localArchive}`);
  } finally {
    if (!switched && frozen) await admin.query('ALTER DATABASE mak_delivery ALLOW_CONNECTIONS true');
    if (!switched && appStopped) compose(['start', '--wait', 'delivery-app']);
    await admin.end();
    compose(['exec', '-T', 'db', 'rm', '-f', '/tmp/render-refresh.dump', '/tmp/local-before-refresh.dump']);
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
