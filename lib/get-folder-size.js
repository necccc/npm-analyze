const fsUtils = require('nodejs-fs-utils')

module.exports = (folder) => {
  return new Promise((resolve, reject) => {
    // treat the symbolic links as folders if these links to directories
    fsUtils.fsize(folder, {
      symbolicLinks: false,
      countFolders: false
    }, function (err, size) {
      if (err) {
        reject(err)
        return
      }

      resolve(size)
    })
  })
}
