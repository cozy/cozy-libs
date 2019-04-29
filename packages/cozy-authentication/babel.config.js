module.exports = {
  env: {
    transpilation: {
      presets: [
        ["cozy-app", { presetEnv: { modules: false }, transformRuntime: { helpers: true }}]
      ],
      plugins: [
        [
          "css-modules-transform",
          {
            extensions: [".styl"],
            preprocessCss: "./preprocess",
            extractCss: "./dist/stylesheet.css",
            generateScopedName: "[name]__[local]___[hash:base64:5]"
          }
        ]
      ]
    },
    test: {
      presets: [["cozy-app", { transformRuntime: { helpers: true }}]]
    }
  },
  ignore: ["*.spec.js", "*.spec.jsx"]
}
