const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const lib = process.env.TARGET
const styleguideDir = `./build${lib ? `/${lib}` : ''}`

module.exports = {
  components: `../packages/${lib || '**'}/src/components/**/*.jsx`,
  serverPort: 6262,
  styleguideDir,
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules\/(?!(cozy-ui)\/).*/,
          loader: 'babel-loader'
        },
        {
          test: /node_modules\/cozy-ui\/(.*)\.styl$/,
          loader: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[local]--[hash:base64:5]'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin('[name].css'),
      new webpack.DefinePlugin({
        'process.env': {
          USE_REACT: 'true'
        }
      })
    ]
  }
}
