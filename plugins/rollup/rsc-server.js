import path from 'node:path';

import consola from 'consola';

import { BUILD_DIR, REACT_COMPONENT_REGEX } from '#constants';
import { clientEntryPoints } from '#globals';

/**
 * @returns {import('rollup').Plugin<{}>}
 */
export default function rscServer() {
  return {
    name: 'rsc-server',
    version: '0.0.1',
    async resolveId(source, importer) {
      try {
        if (REACT_COMPONENT_REGEX.test(source)) {
          const filePath = path.isAbsolute(source)
            ? source
            : path.join(importer ? path.dirname(importer) : '', source);

          const moduleInfo = await this.load({ id: filePath });

          if (
            moduleInfo.code &&
            (moduleInfo.code.startsWith("'use client'") ||
              moduleInfo.code.startsWith('"use client"'))
          ) {
            const buildFilePath = path
              .join(BUILD_DIR, path.basename(filePath))
              .replace(REACT_COMPONENT_REGEX, '.js');

            clientEntryPoints.add(filePath);

            // Return an object with `id` and `external` to indicate the module is external
            return {
              id: `../client/${path.relative(BUILD_DIR, buildFilePath)}`,
              external: 'relative'
            };
          }
        }

        return null;
      } catch (error) {
        consola.error(error);

        return null;
      }
    }
  };
}
