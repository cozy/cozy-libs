const fs = require('fs')

const { CachedInputFileSystem, ResolverFactory } = require('enhanced-resolve')
const webpack = require('webpack')

const pluginName = 'PackageInfoPlugin'

const pick = (obj, fields) => {
  const res = {}
  for (let field of fields) {
    res[field] = obj[field]
  }
  return res
}

class PackageInfoPlugin {
  constructor(options) {
    this.varName = options.varName || '__PACKAGES__'
    this.packages = options.packages
    this.fields = options.fields || ['version']
  }
  async apply(compiler) {
    // Create a resolver with the same options as the compiler
    const resolver = ResolverFactory.createResolver({
      fileSystem: new CachedInputFileSystem(fs, 4000),
      extensions: ['.json'],
      modules: compiler.options.resolve.modules,
      alias: compiler.options.resolve.alias
    })

    // We need to collect info before the compilation because we will use
    // the DefinePlugin that is run at the `compilation` stage
    compiler.hooks.beforeCompile.tapAsync(
      pluginName,
      async (params, callback) => {
        // Collect info of all packages specified in options
        const info = {}
        for (let pkg of this.packages) {
          const path = await resolvePromise(resolver, `${pkg}/package.json`)
          const data = JSON.parse(fs.readFileSync(path))
          info[pkg] = pick(data, this.fields)
        }
        const definitions = {}
        definitions[this.varName] = JSON.stringify(info)

        // Create a DefinePlugin and apply it to the compiler
        const df = new webpack.DefinePlugin(definitions)
        df.apply(compiler)
        callback()
      }
    )
  }
}

const resolvePromise = (resolver, request) =>
  new Promise((resolve, reject) => {
    const resolveContext = {}
    resolver.resolve(
      {},
      __dirname,
      request,
      resolveContext,
      (err, filepath) => (err && reject(err)) || resolve(filepath)
    )
  })

module.exports = PackageInfoPlugin
