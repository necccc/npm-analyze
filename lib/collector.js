const chalk = require('chalk')

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
      .reverse()
  }

  top (n = 10) {
    return this.stats().slice(0, n)
  }

  topColumnified (n = 10) {
    return this.top(n).map((value) => {
      return {
        item: chalk.gray(value[0]),
        count: chalk.yellow(value[1])
      }
    })
  }

  raw () {
    return this.data
  }

  count () {
    return Object.values(this.data)
      .reduce((sum, count) => { return sum + count }, 0)
  }
}
