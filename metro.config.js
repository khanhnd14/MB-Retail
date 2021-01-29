module.exports = {
  transformer: {
    babelTransformerPath: require.resolve('./transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },

}
