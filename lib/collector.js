const numeral = require('numeral')
const chalk = require('chalk')

const PERCENT_FORMAT = '0.00 %'

const percent = (num, total) => {
  return numeral(num / total).format(PERCENT_FORMAT)
}

module.exports = class Collector {
  constructor (type) {
    this.type = type
    this.data = {}
  }

  add (dir) {
    if (!this.data[dir]) {
      this.data[dir] = 0
    }

    this.data[dir] += 1
  }

  stats (total = 0) {
    return Object.entries(this.data)
      .sort((a, b) => { return a[1] - b[1] })
      .map(entry => {
        if (total === 0) return entry

        return [...entry, percent(entry[1], total)]
      })
      .reverse()
  }

  top (n = 10, total = 0) {
    return this.stats(total).slice(0, n)
  }

  topColumnified (n = 10, total = 0) {
    return this.top(n, total).map((value) => {
      return {
        item: chalk.gray(value[0]),
        count: chalk.yellow(value[1]),
        percent: chalk.green(value[2])
      }
    })
  }

  count () {
    return Object.values(this.data)
      .reduce((sum, count) => { return sum + count }, 0)
  }
}
