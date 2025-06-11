const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const { ModuleFederationPlugin } = webpack.container

const deps = require('./package.json').dependencies

const srcPath = path.join(__dirname, 'src')
const dstPath = path.join(__dirname, 'build/debug')

module.exports = {
  context: srcPath,
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './index',
  output: {
    path: dstPath,
    publicPath: '/',
  },
  resolve: {
    modules: [srcPath, 'node_modules'],
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  devServer: {
    port: 8090,
    historyApiFallback: true,
    hot: false,
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
            options: { modules: { localIdentName: 'appshell_[local]__[hash:base64]' } },
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
      name: 'appshell',
      filename: 'remoteEntry.js',
      remotes: {
        appshell: 'appshell@http://localhost:8090/remoteEntry.js',
        remote1: 'remote1@http://localhost:8093/remoteEntry.js'
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
    new HtmlWebPackPlugin({
      template: 'index.html',
    })
  ],
}
