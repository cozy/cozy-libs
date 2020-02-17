module.exports = {
  presets: [
    [
      'cozy-app',
      {
        presetEnv: {
          modules: process.env.BABEL_ENV == 'es5' ? 'commonjs' : false
        },
        transformRuntime: { helpers: true }
      }
    ]
  ],
  plugins: ['inline-react-svg'],
  env: {
    test: {
      presets: [['cozy-app', { transformRuntime: { helpers: true } }]]
    }
  }
}
