import { resolve } from 'dns'
import * as webpack from 'webpack'
import * as Path from 'path'
import * as CleanPlugin from 'clean-webpack-plugin'
import { TsConfigPathsPlugin } from 'awesome-typescript-loader'

import { isomorphicConfig } from './isomorphic-tools'
import * as WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin'

import { webpackBaseConfig } from './base'

import * as ExtractTextPlugin from 'extract-text-webpack-plugin'

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(isomorphicConfig)
const projectRootPath = Path.resolve(__dirname, '../')
const assetsPath = Path.resolve(projectRootPath, './static/dist')

const extractTextPlugin = new ExtractTextPlugin({
  filename: '[name].[hash].css',
  disable: process.env.NODE_ENV === 'development',
  allChunks: true,
})

export default { // export default, because webpack expects json format
  ...webpackBaseConfig,
  entry: {
    main: [
      './src/client.tsx',
    ],
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js',
    publicPath: '/static/dist/',
  },
  plugins: [
    new CleanPlugin([assetsPath], { root: projectRootPath }),
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
    new TsConfigPathsPlugin(/* { tsconfig, compiler } */),
    webpackIsomorphicToolsPlugin,
    new webpack.DefinePlugin({
      'process.env': {
        EXEC_ENV: JSON.stringify('client'),
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    extractTextPlugin,
  ],
  module: {
    rules: [
      ...webpackBaseConfig.module.rules,
      {
        test: /\.scss$/,
        loader: extractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                modules: true,
                localIdentName: '[name]__[local]',
              },
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'expanded',
                sourceMap: true,
                sourceMapContents: true,
              },
            },
          ],
          fallback: 'style-loader',
        }),
      },
    ],
  },
}
