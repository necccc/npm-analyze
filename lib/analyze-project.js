const humanFormat = require('human-format')
const packlist = require('npm-packlist')
const escapeStringRegexp = require('escape-string-regexp')
const sumSize = require('./size-summary')
const printOutput = require('./print-output')
const { FOLDERS, FILES } = require('./lists')
const projectDir = process.cwd()
const folderMatchers = FOLDERS.map(folder => new RegExp(`${escapeStringRegexp(folder)}/`))

module.exports = async function ({ jsonOutput }) {
  console.log('\nnpm analyze current project')

  const result = {}
  const folderMatch = (folder) => {
    return folderMatchers.reduce((match, matcher) => {
      if (match) {
        return match
      }
      return matcher.test(folder)
    }, false)
  }

  const files = await packlist({ path: projectDir })
  const unusedFiles = files.filter((file) => {
    if (FILES.includes(file)) {
      return true
    }

    if (/\.test\.js$/.test(file)) {
      return true
    }

    if (folderMatch(file)) {
      return true
    }
  })

  result.packageFileCount = files.length

  if (unusedFiles.length > 0) {
    result.unusedFileCount = unusedFiles.length
    result.unusedFileSize = humanFormat(await sumSize(unusedFiles))
  }

  if (jsonOutput) {
    const data = Object.assign({}, result)
    console.log(JSON.stringify(data))
    return
  }

  printOutput(
    result
  )

  if (unusedFiles.length < 1) {
    return
  }

  console.log('\nUnused files')
  console.log('------------')
  console.log(unusedFiles)
  console.log('\nPlease update your "files" field in your package.json, ')
  console.log('or your .npmignore file, to prevent these to be packaged')
  console.log('in your npm tarball.\n')
}
