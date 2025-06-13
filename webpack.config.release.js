const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const ExternalTemplateRemotesPlugin = require('external-remotes-plugin')

const { ModuleFederationPlugin } = webpack.container

const deps = require('./package.json').dependencies

const srcPath = path.join(__dirname, 'src')
const dstPath = path.join(__dirname, 'build')

const MODULE_NAME = 'appshell'

module.exports = {
  context: srcPath,
  mode: 'production',
  devtool: false,
  entry: './index',
  output: {
    clean: true,
    pathinfo: false,
    path: dstPath,
    publicPath: '/',
    uniqueName: MODULE_NAME,
    filename: '[name].[contenthash].js',
  },
  optimization: { minimize: true },
  resolve: {
    modules: [srcPath, 'node_modules'],
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'ts-loader',
        ],
      },
      {
        test: /\.css$/,
        include: srcPath,
        use: [
          'style-loader',
          'css-modules-typescript-loader',
          {
            loader: 'css-loader',
            options: { modules: { localIdentName: `${MODULE_NAME}_[local]__[hash:base64]` } },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: MODULE_NAME,
      filename: 'remoteEntry.js',
      remotes: {
        [MODULE_NAME]: `${MODULE_NAME}@/remoteEntry.js?[window.cacheHash]`,
        remote1: 'remote1@https://remote-1-five.vercel.app/remoteEntry.js?[window.cacheHash]'
      },
      exposes: { './exposed': './exposed' },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
      },
    }),
    new ExternalTemplateRemotesPlugin(),
    new HtmlWebPackPlugin({
      template: 'index.html',
      excludeChunks: [MODULE_NAME],
    })
  ],
}
