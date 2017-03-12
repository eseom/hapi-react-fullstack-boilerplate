#!/usr/bin/env node
/* eslint import/no-extraneous-dependencies: "off" */

require('../tools/babel-require')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')

global.CLIENT = false
global.SERVER = true
global.DISABLE_SSR = false
global.DEVELOPMENT = process.env.NODE_ENV !== 'production'

if (DEVELOPMENT) {
  if (!require('piping')({
    hook: true,
    ignore: /(\/\.|~$|\.json|\.scss$)/i,
  })) {
    return
  }
}

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicTools = require('webpack-isomorphic-tools')
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../tools/isomorphic-tools'))
  .server(rootDir, () => {
    require('../src/server')
  })
