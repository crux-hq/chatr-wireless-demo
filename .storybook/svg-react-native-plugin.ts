import { readFileSync } from 'node:fs';
import { transform } from '@svgr/core';
import { transformWithEsbuild } from 'vite';
import type { Plugin } from 'vite';

const VIRTUAL_PREFIX = '\0svg-react-native:';

const svgrConfig = {
  native: true,
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            inlineStyles: {
              onlyMatchedOnce: false,
            },
            removeViewBox: false,
            removeUnknownsAndDefaults: false,
            convertColors: false,
          },
        },
      },
    ],
  },
};

export function svgReactNativePlugin(): Plugin {
  return {
    name: 'svg-react-native',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (!source.endsWith('.svg') || source.startsWith(VIRTUAL_PREFIX)) {
        return null;
      }

      const resolved = await this.resolve(source, importer, {
        ...options,
        skipSelf: true,
      });

      if (!resolved) {
        return null;
      }

      return `${VIRTUAL_PREFIX}${resolved.id}`;
    },
    async load(id) {
      if (!id.startsWith(VIRTUAL_PREFIX)) {
        return null;
      }

      const filepath = id.slice(VIRTUAL_PREFIX.length).split('?')[0];
      const svg = readFileSync(filepath, 'utf-8');
      const jsx = await transform(svg, svgrConfig, { filePath: filepath });

      return transformWithEsbuild(jsx, `${filepath}.jsx`, {
        loader: 'jsx',
        jsx: 'automatic',
      });
    },
  };
}
