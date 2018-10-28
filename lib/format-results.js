const chalk = require('chalk')
const labels = require('./labels.json')

module.exports = (result) => {
  return Object.entries(result).map(([key, value]) => {
    return [ `\t` + chalk.gray(labels[key]), chalk.yellow(value) ]
  }).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {})
}
