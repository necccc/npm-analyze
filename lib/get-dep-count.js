
module.exports = function () {
  let pkg

  try {
    pkg = require(process.cwd() + '/package.json')
  } catch (e) {
    console.log('Missing package.json!')
    process.exit(1)
  }

  const depCount = pkg.dependencies ? Object.keys(pkg.dependencies).length : 0
  const devdepCount = pkg.devDependencies ? Object.keys(pkg.devDependencies).length : 0
  return depCount + devdepCount
}
