const pjson = require('../package.json')
require('babel-register')(pjson.babel)

const PrettyError = require('pretty-error')

const pe = new PrettyError()
pe.start()
