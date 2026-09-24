import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const product = process.argv[2] && resolve(process.argv[2]);
if (!product || !existsSync(join(product, 'package.json'))) {
  throw new Error('Usage: node scripts/prepare-product.mjs /absolute/path/to/product');
}
const packagePath = join(product, 'package.json');
const lockPath = join(product, 'package-lock.json');
const originalPackage = readFileSync(packagePath, 'utf8');
const originalLock = existsSync(lockPath) ? readFileSync(lockPath, 'utf8') : null;
const metadata = JSON.parse(originalPackage);
const source = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const releaseBase = `${source.homepage}/releases/download/`;
const dependencies = [];
for (const section of ['dependencies', 'devDependencies']) {
  for (const [name, url] of Object.entries(metadata[section] || {})) {
    if (!name.startsWith('@cci/')) continue;
    const filename = `${name.slice(1).replace('/', '-')}-${source.version}.tgz`;
    if (url !== `${releaseBase}v${source.version}/${filename}`) {
      throw new Error(`${name} must pin the public UI release ${source.version}; found ${url}.`);
    }
    const archive = join(root, 'releases', filename);
    if (!existsSync(archive)) throw new Error(`Missing ${archive}. Run npm run release in the UI repository first.`);
    dependencies.push({ name, section, url, archive,
      integrity: `sha512-${createHash('sha512').update(readFileSync(archive)).digest('base64')}` });
  }
}
if (!dependencies.length) throw new Error('The product has no public UI dependencies.');

function npm(args) {
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, {
    cwd: product, stdio: 'inherit',
  });
  if (result.status !== 0) throw new Error(`npm ${args.join(' ')} failed (${result.status}).`);
}

try {
  // Resolve the candidate locally, then retain public, portable URLs in Git.
  // No product stores source copies or requires access to the private framework.
  for (const { name, section, archive } of dependencies) metadata[section][name] = `file:${archive}`;
  writeFileSync(packagePath, `${JSON.stringify(metadata, null, 2)}\n`);
  npm(['install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund']);
  const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
  for (const { name, section, url, integrity, archive } of dependencies) {
    const installed = lock.packages[`node_modules/${name}`];
    if (!installed || installed.link || installed.version !== source.version || installed.integrity !== integrity) {
      throw new Error(`Lockfile does not match the candidate archive ${name}.`);
    }
    lock.packages[''][section][name] = url;
    installed.resolved = url;
    // npm can install by integrity from its content-addressable cache before
    // the release has been published. External contributors use the public URL.
    npm(['cache', 'add', archive, '--ignore-scripts']);
  }
  writeFileSync(packagePath, originalPackage);
  writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
  npm(['ci', '--prefer-offline', '--no-audit', '--no-fund']);
} catch (error) {
  writeFileSync(packagePath, originalPackage);
  if (originalLock !== null) writeFileSync(lockPath, originalLock);
  else rmSync(lockPath, { force: true });
  throw error;
}
console.log(`${basename(product)} now uses the prepared public UI release ${source.version}.`);
