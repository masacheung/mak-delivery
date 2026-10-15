// Production credentials are read only for backup; never passed to the local app.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const dotenv = require('../server/node_modules/dotenv');
const root = path.resolve(__dirname, '..');
process.chdir(root);
const envFile = path.join(root, '.env.docker');
const backupDir = path.join(root, 'backups');
function run(args, extraEnv = {}, capture = false) {
  const r = spawnSync('docker', args, { env: { ...process.env, ...extraEnv }, stdio: capture ? 'pipe' : 'inherit', encoding: 'utf8' });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(capture ? r.stderr : `Docker failed (exit ${r.status})`);
  return r.stdout;
}
function compose(args, capture = false) {
  if (!fs.existsSync(envFile)) throw new Error('Run setup first.');
  return run(['compose', '--env-file', envFile, ...args], {}, capture);
}
async function main() {
  const [command, file] = process.argv.slice(2);
  if (command === 'setup') {
    if (!fs.existsSync(envFile)) fs.writeFileSync(envFile, `LOCAL_DB_PASSWORD=${crypto.randomBytes(32).toString('hex')}\nLOCAL_JWT_SECRET=${crypto.randomBytes(48).toString('hex')}\n`, { flag: 'wx', mode: 0o600 });
    console.log('Local Docker secrets ready.');
  } else if (command === 'backup') {
    const source = dotenv.parse(fs.readFileSync(path.join(root, '.env')));
    for (const key of ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE']) if (!source[key]) throw new Error(`Missing ${key} in .env`);
    if (!source.DB_HOST.endsWith('.render.com')) throw new Error('Backup source must be a Render database.');
    fs.mkdirSync(backupDir, { recursive: true });
    const name = `render-${new Date().toISOString().replace(/[:.]/g, '-')}.dump`;
    // pg_dump uses a consistent snapshot without stopping the live application.
    run(['run', '--rm', '--mount', `type=bind,source=${backupDir},target=/backup`, '-e', 'PGHOST', '-e', 'PGPORT', '-e', 'PGUSER', '-e', 'PGPASSWORD', '-e', 'PGDATABASE', '-e', 'PGSSLMODE', 'postgres:18-alpine', 'pg_dump', '--format=custom', '--no-owner', '--no-acl', '--file', `/backup/${name}`], {
      PGHOST: source.DB_HOST, PGPORT: source.DB_PORT || '5432', PGUSER: source.DB_USER,
      PGPASSWORD: source.DB_PASSWORD, PGDATABASE: source.DB_DATABASE, PGSSLMODE: 'require'
    });
    run(['run', '--rm', '--mount', `type=bind,source=${backupDir},target=/backup,readonly`, 'postgres:18-alpine', 'pg_restore', '--list', `/backup/${name}`], {}, true);
    const archive = fs.readFileSync(path.join(backupDir, name));
    fs.writeFileSync(path.join(backupDir, `${name}.json`), JSON.stringify({ createdAt: new Date().toISOString(), file: name, bytes: archive.length, sha256: crypto.createHash('sha256').update(archive).digest('hex'), source: 'Render PostgreSQL', liveServiceStopped: false }, null, 2));
    console.log(`Verified backup: backups/${name} (${archive.length} bytes)`);
  } else if (command === 'restore') {
    if (!file || path.basename(file) !== file || !file.endsWith('.dump')) throw new Error('Pass a .dump filename from backups/.');
    const archivePath = path.join(backupDir, file);
    const metadata = JSON.parse(fs.readFileSync(`${archivePath}.json`, 'utf8'));
    if (crypto.createHash('sha256').update(fs.readFileSync(archivePath)).digest('hex') !== metadata.sha256) throw new Error('Backup checksum mismatch.');
    compose(['up', '-d', '--wait', 'db']);
    const count = compose(['exec', '-T', 'db', 'psql', '-U', 'mak_delivery', '-d', 'mak_delivery', '-Atc', "SELECT count(*) FROM pg_tables WHERE schemaname='public'"], true).trim();
    if (count !== '0') throw new Error('Local database is not empty. Restore refused to protect existing data.');
    compose(['cp', archivePath, 'db:/tmp/render.dump']);
    try { compose(['exec', '-T', 'db', 'pg_restore', '--exit-on-error', '--single-transaction', '--no-owner', '--no-acl', '-U', 'mak_delivery', '-d', 'mak_delivery', '/tmp/render.dump']); }
    finally { compose(['exec', '-T', 'db', 'rm', '-f', '/tmp/render.dump']); }
    compose(['exec', '-T', 'db', 'psql', '-U', 'mak_delivery', '-d', 'mak_delivery', '-c', "SELECT schemaname, tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"]);
    console.log('Backup restored into local Docker database.');
  } else if (command === 'up') {
    const networks = run(['network', 'ls', '--filter', 'name=^cheung-hub-ingress$', '--format', '{{.Name}}'], {}, true).trim();
    if (!networks) run(['network', 'create', 'cheung-hub-ingress']);
    compose(['up', '-d', '--build', '--wait']);
  }
  else if (command === 'stop') compose(['stop']);
  else if (command === 'status') compose(['ps']);
  else throw new Error('Usage: node scripts/local-docker.cjs setup|backup|restore <filename.dump>|up|stop|status');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
