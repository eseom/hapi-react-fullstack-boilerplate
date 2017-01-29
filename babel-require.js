// @flow

try {
  const config = require('./package.json').babel;
  require('babel-register')(config);
} catch (err) {
  console.error('==>     ERROR: Error parsing your babel.json.');
  console.error(err);
}
