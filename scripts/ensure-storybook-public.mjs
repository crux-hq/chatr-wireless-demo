import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const storybookIndex = path.join(root, 'public/storybook/index.html');
const storiesDir = path.join(root, 'stories');

function newestMtime(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return 0;
  }

  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    return stat.mtimeMs;
  }

  let newest = stat.mtimeMs;
  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    newest = Math.max(newest, newestMtime(path.join(targetPath, entry.name)));
  }
  return newest;
}

const needsBuild =
  !fs.existsSync(storybookIndex) ||
  newestMtime(storiesDir) > fs.statSync(storybookIndex).mtimeMs ||
  newestMtime(path.join(root, '.storybook')) > fs.statSync(storybookIndex).mtimeMs;

if (!needsBuild) {
  console.log('Storybook static build is up to date.');
  process.exit(0);
}

console.log('Building Storybook for /storybook…');
const result = spawnSync('node', ['scripts/build-storybook-static.mjs'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
