import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

import css from 'rollup-plugin-import-css';

import { rscServer, rscClient, preserveDirectives } from '#plugins/rollup';

const commonPlugins = [
  commonjs({
    include: 'node_modules/**'
  }),
  nodeResolve({ extensions: ['.json', '.js'] }),
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }),
  json({
    compact: true,
    preferConst: true,
    namedExports: false
  })
];

export default defineConfig([
  /** Build the server component tree */
  {
    input: [
      fileURLToPath(new URL('./src/app/rsc-page.jsx', import.meta.url)),
      fileURLToPath(new URL('./src/app/ssr-page.jsx', import.meta.url))
    ],
    output: {
      dir: 'build/app',
      format: 'esm'
    },
    onwarn(warning, warn) {
      if (
        (warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
          warning.message.includes('"use client"')) ||
        (warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
          warning.message.includes('"react"'))
      ) {
        return;
      }

      warn(warning);
    },
    external: ['react', 'react/jsx-runtime'],
    plugins: [
      ...commonPlugins,
      rscServer(),
      babel({
        extensions: ['.json', '.js', '.jsx'],
        exclude: ['build/**', 'node_modules/**'],
        babelHelpers: 'bundled'
      })
    ]
  },

  /** Build client components */
  {
    input: [
      fileURLToPath(new URL('./src/client/rsc.jsx', import.meta.url)),
      fileURLToPath(new URL('./src/client/ssr.js', import.meta.url))
    ],
    output: {
      dir: 'build/client',
      format: 'esm',
      sourcemap: true
    },
    onwarn(warning, warn) {
      if (
        warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
        warning.message.includes(`"use client"`)
      ) {
        return;
      }

      warn(warning);
    },
    plugins: [
      ...commonPlugins,
      css({
        alwaysOutput: true,
        inject: true
      }),
      babel({
        extensions: ['.json', '.js', '.jsx'],
        exclude: ['build/**', 'node_modules/**'],
        babelHelpers: 'inline'
      }),
      preserveDirectives(),
      rscClient()
    ]
  }
]);
