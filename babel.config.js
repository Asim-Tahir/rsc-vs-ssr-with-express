/** @type {import('@babel/core').TransformOptions} */
export default {
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      }
    ]
  ],
  plugins: [
    '@babel/plugin-syntax-import-attributes',
  ]
};
