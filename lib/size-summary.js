const getFolderSize = require('./get-folder-size')

const sum = (sizes) => {
  const f = (sum, size) => {
    sum += size
    return sum
  }
  return sizes.reduce(f, 0)
}

module.exports = async (paths) => {
  const pathsSliced = paths.reduce((arr, path, i) => {
    if (i % 20 === 0) arr.push([])
    arr[arr.length - 1].push(path)
    return arr
  }, [])

  let sizes = []

  for (let group of pathsSliced) {
    sizes = sizes.concat(await Promise.all(group.map(folder => getFolderSize(folder))))
  }

  return sum(sizes)
}
