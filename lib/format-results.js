const chalk = require('chalk')

module.exports = (result) => {
  return Object.entries(result).map(([key, value]) => {
    return [ `\t` + chalk.gray(key), chalk.yellow(value) ]
  }).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {})
}
