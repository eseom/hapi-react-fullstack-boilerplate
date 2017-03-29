const fs = require('fs')
const path = require('path')

const file = fs.readFileSync(path.resolve('./package.json'))
const config = JSON.parse(file).babel
require('babel-register')(config)
const settings = require('../settings')

module.exports = settings.database[process.env.NODE_ENV || 'development']
