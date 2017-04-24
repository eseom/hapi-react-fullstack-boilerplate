#!/usr/bin/env node
/* eslint import/no-extraneous-dependencies: "off" */

require('../tools/babel-require')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

global.CLIENT = false
global.SERVER = true
global.DISABLE_SSR = false
global.DEVELOPMENT = process.env.NODE_ENV !== 'production'

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicTools = require('webpack-isomorphic-tools')
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../tools/isomorphic-tools'))
  .server(rootDir, () => {
    require('../src/server')
  })
