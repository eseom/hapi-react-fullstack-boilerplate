var webpack = require('webpack');
var babelrcObject = require('./package.json').babel

module.exports = function (config) {
  config.set({

    browsers: ['PhantomJS'],

    singleRun: !!process.env.CI,

    frameworks: [ 'mocha' ],

    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './tools/tests-webpack.js'
    ],

    preprocessors: {
      './tools/tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

    reporters: [ 'mocha' ],

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-phantomjs-launcher"),
      require("karma-sourcemap-loader")
    ],

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.(jpe?g|png|gif|svg)$/, loader: 'url', query: {limit: 10240} },
          { test: /\.js$/, exclude: /node_modules/, use: [{ loader: 'babel-loader', options: babelrcObject }]},
          { test: /\.json$/, loader: 'json-loader' },
          {
            test: /Html\.scss$/,
            use: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  modules: false,
                },
              },
              {
                loader: 'sass-loader',
              },
            ],
          },
          {
            test: /\.scss$/,
            exclude: /Html\.scss$/,
            use: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  modules: true,
                },
              },
              {
                loader: 'sass-loader',
              },
            ],
          },
        ]
      },
      resolve: {
        modules: [
          'src',
          'node_modules'
        ],
        extensions: ['.json', '.js']
      },
      plugins: [
        new webpack.IgnorePlugin(/\.json$/),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          CLIENT: true,
          SERVER: false,
          DEVELOPMENT: true,
        })
      ]
    },
    webpackServer: {
      noInfo: true
    }
  });
};
