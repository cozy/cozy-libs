import fs from 'fs'
import path from 'path'

import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginStylus } from '@rsbuild/plugin-stylus'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
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
        fastRefresh: import.meta.env.NODE_ENV === 'development'
      }),
      pluginStylus({
        stylusOptions: {
          // To resolve import from cozy-ui inside stylus files
          paths: [path.resolve(appPath, 'node_modules', 'cozy-ui', 'stylus')]
        }
      }),
      pluginSvgr({
        svgrOptions: {
          // To import every SVG imported in Cozy apps as React components understandable by cozy-ui Icon component
          exportType: 'default'
        }
      })
    ],
    // Used when running `rsbuild dev`
    // By default the dev configuration would serve app's files from localhost:300
    // which is not what we want as we expect to serve apps from a local cozy-stack
    dev: {
      progressBar: true,
      // this param tells to put files in the output folder so we can access them from cozy-stack
      writeToDisk: true,
      // this param tells the cozy-app which URL to use for the HMR websocket, otherwise it would use the cozy-stack URL by default
      client: {
        host: 'rsbuild.cozy.tools', // we cannot use localhost because chromium browsers prevent unsecure websockets to localhost
        protocol: 'ws',
        port: '<port>'
      }
    },
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
            },
            // We want to keep static images used by cozy-ui inside components
            {
              test: /\.(png|jpe?g|gif)$/i,
              include: /cozy-ui\/transpiled\/react(\/|\\)/,
              type: 'asset/resource'
            },
            // We want to keep static images used by cozy-dataproxy-lib inside components
            {
              test: /\.(png|jpe?g|gif)$/i,
              include: /cozy-dataproxy-lib\/dist\/assets(\/|\\)/,
              type: 'asset/resource'
            }
          ]
        },
        plugins: [
          // Only register the plugin when RSDOCTOR is true, as the plugin will increase the build time.
          process.env.RSDOCTOR && new RsdoctorRspackPlugin()
        ].filter(Boolean)
      },
      htmlPlugin: {
        inject: false,
        hash: true
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
          dev: {
            assetPrefix: '/public'
          },
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
          dev: {
            assetPrefix: '/intents'
          },
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
