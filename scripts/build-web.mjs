import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(command, args, env = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...env },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function writeServeConfig(distDir) {
  fs.writeFileSync(
    path.join(distDir, 'serve.json'),
    JSON.stringify(
      {
        cleanUrls: false,
        rewrites: [{ source: '/storybook', destination: '/storybook/index.html' }],
      },
      null,
      2,
    ),
  );
}

console.log('Building Storybook static site…');
run('node', ['scripts/build-storybook-static.mjs']);

console.log('Building Expo web app…');
run('npx', ['expo', 'export', '--platform', 'web']);

writeServeConfig(path.join(root, 'dist'));
console.log('Done. App and Storybook are available at / and /storybook');
