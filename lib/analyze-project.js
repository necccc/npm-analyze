const humanFormat = require('human-format')
const packlist = require('npm-packlist')
const escapeStringRegexp = require('escape-string-regexp')
const chalk = require('chalk')
const sumSize = require('./size-summary')
const printOutput = require('./print-output')
const { FOLDERS, FILES } = require('./lists')
const projectDir = process.cwd()
const folderMatchers = FOLDERS.map(folder => new RegExp(`${escapeStringRegexp(folder)}/`))

module.exports = async function ({ jsonOutput }) {
  if (!jsonOutput) {
    console.log('\nnpm analyze current project')
  }

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
  } else {
    result.unusedFileCount = 0
    result.unusedFileSize = 0
  }

  if (jsonOutput) {
    const data = Object.assign({}, result, { unusedFiles })
    console.log(JSON.stringify(data))
    return
  }

  printOutput(
    result
  )

  if (unusedFiles.length < 1) {
    console.log(`\n${chalk.green('Looks good :)')}`)
    return
  }

  console.log(`\n${chalk.red('Unused files')}`)
  console.log('------------')
  unusedFiles.map(f => chalk.yellow(f)).forEach(f => console.log(f))
  console.log(chalk.red('\nPlease update your "files" field in your package.json, '))
  console.log(chalk.red('or your .npmignore file, to prevent these to be packaged'))
  console.log(chalk.red('in your npm tarball.\n'))

  process.exit(1)
}
