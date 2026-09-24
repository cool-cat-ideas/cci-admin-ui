import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Explicit allowlist: adding a workspace must never implicitly publish it.
const packages = ['admin-core', 'admin-theme', 'admin-ui', 'presta-adapter', 'wp-adapter'];
const destination = join(root, 'releases');
const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
function npm(args, capture = false) {
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, {
    cwd: root, encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  });
  if (result.status !== 0) throw new Error(`npm ${args.join(' ')} failed (${result.status}).`);
  return result.stdout;
}

mkdirSync(destination, { recursive: true });
npm(['run', 'build']);
const manifest = [];
for (const name of packages) {
  const packageDir = join(root, 'packages', name);
  const metadata = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'));
  if (metadata.private || metadata.version !== version || metadata.license !== 'MIT') {
    throw new Error(`Invalid public package metadata: ${name}`);
  }
  const [plan] = JSON.parse(npm(['pack', `./packages/${name}`, '--dry-run', '--json'], true));
  for (const { path } of plan.files) {
    if (!/^(package\.json|README\.md|LICENSE|(?:src|dist|scripts)\/)/.test(path)
      || /license-php|CciLicenseRuntime|\.pem$|local-media-library-runtime/.test(path)) {
      throw new Error(`Unexpected public package file: ${name}/${path}`);
    }
  }
  const [packed] = JSON.parse(npm(['pack', `./packages/${name}`, '--pack-destination', destination, '--json'], true));
  const bytes = readFileSync(join(destination, packed.filename));
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  writeFileSync(join(destination, `${packed.filename}.sha256`), `${sha256}  ${packed.filename}\n`);
  manifest.push({ name: metadata.name, version, filename: packed.filename,
    integrity: `sha512-${createHash('sha512').update(bytes).digest('base64')}`, sha256 });
}
writeFileSync(join(destination, 'packages.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Public UI packages prepared in ${destination}. Nothing was uploaded.`);
