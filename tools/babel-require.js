try {
  const config = require('../package.json').babel

  // issue with npm linking
  // https://github.com/webpack/webpack/issues/1866
  // https://github.com/babel/babel-loader/issues/166#issuecomment-196888445
  // match with babel config in package.json
  config.presets = config.presets.map(item => {
if(Array.isArray(item)) {
return require.resolve(`babel-preset-${item[0]}`)
} else {
return require.resolve(`babel-preset-${item}`)
}
})
  config.plugins = config.plugins.map(item => require.resolve(`babel-plugin-${item}`))
  // end issue with npm linking

  require('babel-register')(config)
  require('babel-polyfill')
} catch (err) {
  console.error('==>     ERROR: Error parsing your config in package.json.')
  console.error(err)
}
