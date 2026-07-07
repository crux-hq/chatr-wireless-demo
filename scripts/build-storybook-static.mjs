import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const storybookBase = '/storybook/';
const buildDir = path.join(root, 'storybook-static');
const outputDir = process.env.STORYBOOK_OUTPUT_DIR
  ? path.resolve(root, process.env.STORYBOOK_OUTPUT_DIR)
  : path.join(root, 'public/storybook');

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

function injectStorybookBaseHref(dir, base) {
  for (const file of ['index.html', 'iframe.html']) {
    const filePath = path.join(dir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    const baseTag = `<base href="${base}">`;

    if (!html.includes('<base ')) {
      html = html.replace('<head>', `<head>\n    ${baseTag}`);
      fs.writeFileSync(filePath, html);
    }
  }
}

function copyDir(from, to) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
}

console.log('Building Storybook static site…');
run('npx', ['storybook', 'build', '-o', 'storybook-static'], {
  STORYBOOK_BASE: storybookBase,
});

injectStorybookBaseHref(buildDir, storybookBase);
copyDir(buildDir, outputDir);

console.log(`Storybook ready at ${storybookBase}`);
