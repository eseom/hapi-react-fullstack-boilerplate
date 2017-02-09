try {
  const config = require('./package.json').babel;
  require('babel-register')(config);
} catch (err) {
  console.error('==>     ERROR: Error parsing your config in package.json.');
  console.error(err);
}
