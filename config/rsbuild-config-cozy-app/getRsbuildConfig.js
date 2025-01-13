import fs from 'fs'
import path from 'path'

import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginStylus } from '@rsbuild/plugin-stylus'
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin'
import { pluginEjs } from 'rsbuild-plugin-ejs'

import { getServicesEntries } from './helpers'

/**
 * Generates the configuration object for the Rsbuild tool.
 *
 * @param {Object} options - The options object.
 * @param {string} options.title - The title of the app.
 * @param {boolean} [options.hasPublic] - Indicates if the app has a public target.
 * @param {boolean} [options.hasServices] - Indicates if the app has services target.
 * @param {boolean} [options.hasIntents] - Indicates if the app has a intents target.
 * @returns {Object} The configuration object for Rsbuild.
 */
function getRsbuildConfig({
  enableFastRefresh = false,
  hasServices = false,
  hasPublic = false,
  hasIntents = false,
  title
} = {}) {
  const appPath = fs.realpathSync(process.cwd())

  return {
    plugins: [
      pluginEjs(),
      pluginNodePolyfill(),
      pluginReact({
        fastRefresh: enableFastRefresh
      }),
      pluginStylus({
        stylusOptions: {
          // To resolve import from cozy-ui inside stylus files
          paths: [path.resolve(appPath, 'node_modules', 'cozy-ui', 'stylus')]
        }
      })
    ],
    output: {
      cleanDistPath: true,
      filename: {
        html: 'index.html'
      },
      cssModules: {
        // By default, only .module.styl files are considered as CSS modules by Rsbuild.
        // This option forces all .styl files to be resolved as CSS modules.
        auto: resource => resource.endsWith('.styl')
      }
    },
    performance: {
      chunkSplit: {
        forceSplitting: {
          cozy: /node_modules[\\/]cozy*/
        }
      }
    },
    html: {
      title
    },
    tools: {
      rspack: {
        module: {
          rules: [
            {
              test: /\.webapp$/i,
              type: 'json'
            }
          ]
        },
        plugins: [
          // Only register the plugin when RSDOCTOR is true, as the plugin will increase the build time.
          process.env.RSDOCTOR && new RsdoctorRspackPlugin()
        ].filter(Boolean)
      }
    },
    server: {
      publicDir: {
        copyOnBuild: false
      }
    },
    environments: {
      main: {
        html: {
          template: './src/targets/browser/index.ejs'
        },
        source: {
          entry: {
            main: './src/targets/browser/index.jsx'
          }
        },
        output: {
          target: 'web',
          distPath: {
            root: 'build'
          },
          copy: [
            {
              from: 'manifest.webapp'
            },
            {
              from: 'README.md'
            },
            {
              from: 'LICENSE'
            },
            {
              from: 'public',
              to: 'assets'
            }
          ]
        }
      },
      ...(hasPublic && {
        public: {
          html: {
            template: './src/targets/public/index.ejs'
          },
          source: {
            entry: {
              public: './src/targets/public/index.jsx'
            }
          },
          output: {
            target: 'web',
            distPath: {
              root: 'build/public'
            },
            assetPrefix: '/public'
          }
        }
      }),
      ...(hasIntents && {
        intents: {
          html: {
            template: './src/targets/intents/index.ejs'
          },
          source: {
            entry: {
              intents: './src/targets/intents/index.jsx'
            }
          },
          output: {
            target: 'web',
            distPath: {
              root: 'build/intents'
            },
            assetPrefix: '/intents'
          }
        }
      }),
      ...(hasServices && {
        services: {
          source: {
            entry: getServicesEntries(appPath)
          },
          output: {
            target: 'node',
            distPath: {
              root: 'build/services'
            }
          },
          tools: {
            rspack: {
              module: {
                rules: [
                  {
                    test: /\.hbs$/, // Only for services with notification
                    type: 'asset/source'
                  }
                ]
              }
            }
          }
        }
      })
    }
  }
}

export { getRsbuildConfig }
