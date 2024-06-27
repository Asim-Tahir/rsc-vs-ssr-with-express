import { createFilter } from '@rollup/pluginutils';

import MagicString from 'magic-string';

/**
 * @see {@link https://github.com/Ephem/rollup-plugin-preserve-directives/blob/4705f9e774881fb93186b6a8867adf08bb4afd39/src/index.ts}
 * @param {object} options
 * @param {import('@rollup/pluginutils').FilterPattern} [options.include]
 * @param {import('@rollup/pluginutils').FilterPattern} [options.exclude]
 * @returns {import('rollup').Plugin<{}>}
 */
export default function preserveDirectives(
  options = { include: [], exclude: ['**/*.css'] }
) {
  if (Array.isArray(options.exclude) && !options.exclude.includes('**/*.css')) {
    options.exclude.unshift('**/*.css');
  }

  // Skip CSS files by default, as this.parse() does not work on them
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'preserve-directives',
    // Capture directives metadata during the transform phase
    transform(code, id) {
      // Skip files that are excluded or that are implicitly excluded by the include pattern
      if (!filter(id)) return;

      const ast = this.parse(code);
      if (ast.type === 'Program' && ast.body) {
        /** @type {Array<string>} */
        const directives = [];
        let i = 0;

        // Nodes in body should never be falsy, but issue https://github.com/ephem/rollup-plugin-preserve-directives/issues/5 tells us otherwise
        // so just in case we filter them out here
        const filteredBody = ast.body.filter(Boolean);

        // .type must be defined according to the spec, but just in case..
        while (filteredBody[i]?.type === 'ExpressionStatement') {
          const node = filteredBody[i];
          if ('directive' in node) {
            directives.push(node.directive);
          }
          i += 1;
        }

        if (directives.length > 0) {
          return {
            code,
            ast,
            map: null,
            meta: { preserveDirectives: directives }
          };
        }
      }

      // Return code and ast to avoid having to re-parse and
      // `map: null` to preserve source maps since we haven't modified anything
      return { code, ast, map: null };
    },
    // We check if this chunk has a module with extracted directives
    // and add that to the top.
    // Because we only run this when preserveModules: true there should
    // only be one module per chunk.
    // Banners will already have been inserted here, so directives always
    // ends up at the absolute top.
    renderChunk: {
      order: 'post',
      handler(code, chunk) {
        /** @type {false | Array<string>} */
        let chunkHasDirectives = false;

        // Only do this for OutputChunks, not OutputAssets
        if ('modules' in chunk) {
          for (const moduleId of Object.keys(chunk.modules)) {
            /** @type {Array<string>} */
            const directives =
              this.getModuleInfo(moduleId)?.meta?.preserveDirectives;

            if (directives) {
              chunkHasDirectives = directives;
            }
          }

          if (chunkHasDirectives) {
            const directiveStrings = chunkHasDirectives
              .map((directive) => `"${directive}"`)
              .join(';\n');

            const s = new MagicString(code);
            s.prepend(`${directiveStrings};\n`);
            const srcMap = s.generateMap({ includeContent: true });

            return { code: s.toString(), map: srcMap };
          }
        }

        return null;
      }
    }
  };
}
