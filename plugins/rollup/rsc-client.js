import path from 'node:path';

import { parse } from 'es-module-lexer';

import {
  BUILD_DIR,
  REACT_COMPONENT_REGEX,
  CLIENT_MANIFEST_PATH
} from '#constants';

import { clientEntryPoints } from '#globals';
import { ensureFileExist, clientManifestDB } from '#utils';

/**
 * @typedef {{manifest: string}} RCSClientPluginOptions
 * @param {object} rcsClientOptions
 * @param {string} [rcsClientOptions.clientManifestPath]
 * @returns {import('rollup').Plugin<{}>}
 */
export default function rscClient(
  rcsClientOptions = { clientManifestPath: CLIENT_MANIFEST_PATH }
) {
  const clientManifestPath =
    rcsClientOptions?.clientManifestPath ?? CLIENT_MANIFEST_PATH;

  return {
    name: 'rsc-client',
    version: '0.0.1',
    options(options) {
      if (options.input) {
        if (Array.isArray(options.input)) {
          options.input.push(...clientEntryPoints);
        } else if (typeof options.input === 'object') {
          Array.from(clientEntryPoints).forEach((clientEntryPoint) => {
            // @ts-ignore
            // TODO:  rework on key
            options.input[path.relative(BUILD_DIR, clientEntryPoint)] =
              clientEntryPoint;
          });
        }
      }

      return options;
    },
    async generateBundle(_options, bundle) {
      ensureFileExist(clientManifestPath);

      clientManifestDB.data = {};

      for (const [fileName, chunkOrAsset] of Object.entries(bundle)) {
        if (chunkOrAsset.type === 'chunk') {
          const filePath = path.join(BUILD_DIR, 'client', fileName);

          const [, exports] = parse(chunkOrAsset.code);

          for (const exp of exports) {
            const key = filePath + exp.n;

            clientManifestDB.data[key] = {
              id: `/build/${path.relative(BUILD_DIR, filePath)}`,
              name: exp.n,
              chunks: [],
              async: true
            };
          }

          if (
            chunkOrAsset.facadeModuleId &&
            REACT_COMPONENT_REGEX.test(chunkOrAsset.facadeModuleId) &&
            (chunkOrAsset.code.startsWith("'use client'") ||
              chunkOrAsset.code.startsWith('"use client"'))
          ) {
            let newContents = chunkOrAsset.code;

            for (const exp of exports) {
              const key = filePath + exp.n;

              // Tag each component export with a special `react.client.reference` type
              // and the map key to look up import information.
              // This tells your stream renderer to avoid rendering the
              // client component server-side. Instead, import the built component
              // client-side at `clientComponentMap[key].id`
              newContents += `
${exp.ln}.$$id = ${JSON.stringify(key)};
${exp.ln}.$$typeof = Symbol.for("react.client.reference");`;
            }

            // Update the chunk content
            chunkOrAsset.code = newContents;

            // // Write the modified file to the filesystem
            // this.emitFile({
            //   type: 'asset',
            //   fileName: `components/${fileName}`,
            //   source: newContents
            // });
          }
        }
      }

      await clientManifestDB.write();
    }
  };
}
