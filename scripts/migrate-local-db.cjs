// Runs only against the Docker db service. Never reads Render's root .env.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
process.chdir(root);
function compose(args, input, capture = false) {
  const result = spawnSync('docker', ['compose', '--env-file', '.env.docker', ...args], {
    encoding: 'utf8', input, stdio: capture ? ['pipe', 'pipe', 'pipe'] : ['pipe', 'inherit', 'inherit']
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(capture ? result.stderr : `Docker failed with exit ${result.status}`);
  return result.stdout;
}
function main() {
  const directory = path.join(root, 'backups');
  fs.mkdirSync(directory, { recursive: true });
  const name = `local-before-migrations-${new Date().toISOString().replace(/[:.]/g, '-')}.dump`;
  const backup = path.join(directory, name);
  compose(['exec', '-T', 'db', 'pg_dump', '-U', 'mak_delivery', '-d', 'mak_delivery', '--format=custom', '--no-owner', '--no-acl', '--file=/tmp/local-before-migrations.dump']);
  compose(['exec', '-T', 'db', 'pg_restore', '--list', '/tmp/local-before-migrations.dump'], undefined, true);
  compose(['cp', 'db:/tmp/local-before-migrations.dump', backup]);
  const bytes = fs.readFileSync(backup);
  fs.writeFileSync(`${backup}.json`, JSON.stringify({ createdAt: new Date().toISOString(), source: 'local Docker PostgreSQL', file: name, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }, null, 2));
  compose(['exec', '-T', 'db', 'rm', '-f', '/tmp/local-before-migrations.dump']);
  const migrations = path.join(root, 'server', 'db', 'migrations');
  const files = fs.readdirSync(migrations).filter(file => /^\d+_.*\.sql$/.test(file)).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrations, file), 'utf8');
    const ownTransaction = /^\s*BEGIN;/im.test(sql);
    const body = ownTransaction ? sql : `BEGIN;\n${sql}\nCOMMIT;`;
    console.log(`Applying local migration: ${file}`);
    compose(['exec', '-T', 'db', 'psql', '-X', '-v', 'ON_ERROR_STOP=1', '-U', 'mak_delivery', '-d', 'mak_delivery'], `SET lock_timeout='10s'; SET statement_timeout='60s';\n${body}`);
  }
  console.log(`Local migrations complete. Backup: backups/${name}`);
}
try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
