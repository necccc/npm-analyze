const { promisify } = require('util')
const fs = require('fs')

const fsLStat = promisify(fs.lstat)

module.exports = async (files) => {
  return Promise.all(files.map(file => {
    return fsLStat(file).then(stat => ({ file, stat }))
  }))
}
