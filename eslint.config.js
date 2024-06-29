import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import jsdoc from 'eslint-plugin-jsdoc';

import * as babelParser from '@babel/eslint-parser/experimental-worker';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname, // optional; default: process.cwd()
  resolvePluginsRelativeTo: __dirname, // optional
  recommendedConfig: js.configs.recommended
});

export default tseslint.config(
  {
    ignores: ['.*', '**/*.json', '**/*.css', 'build/**/*', 'node_modules/**/*']
  },
  js.configs.recommended,
  /** @type {import('eslint').Linter.FlatConfig} */ ({
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      globals: {
        ...globals.es2021
      },
      parser: babelParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-description': 'off',
      'unicorn/prefer-node-protocol': 'error'
    }
  }),
  {
    files: [
      '**/*.js',
      '**/*.jsx',
      '!src/client/**/*.js',
      '!src/client/**/*.jsx'
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.nodeBuiltin,
        ...globals.builtin
      }
    }
  },
  {
    files: ['src/client/**/*.js', 'src/client/**/*.jsx'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  /** @type {import('eslint').Linter.FlatConfig} */ ({
    ...reactRecommended,
    files: ['**/*.jsx'],
    settings: {
      react: {
        version: 'detect'
      }
    }
  }),
  {
    files: ['src/types/**/*.d.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended]
  }
);
