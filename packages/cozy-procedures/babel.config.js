module.exports = {
  presets: ['cozy-app'],
  ignore: ['*.spec.js', '*.spec.jsx'],
  env: {
    transpilation: {
      presets: [
        [
          'cozy-app',
          { presetEnv: { modules: false }, transformRuntime: { helpers: true } }
        ]
      ],
      plugins: ['inline-react-svg']
    }
  }
}
