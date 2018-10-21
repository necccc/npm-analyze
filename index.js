const path = require('path')

const humanFormat = require('human-format')
const columnify = require('columnify')
const chalk = require('chalk')
const escapeStringRegexp = require('escape-string-regexp')
const ora = require('ora')

const getDepCount = require('./lib/get-dep-count')
const formatResult = require('./lib/format-results')
const recureaddir = require('./lib/recursive-readdir')
const sumSize = require('./lib/size-summary')
const Collector = require('./lib/collector')

const { FOLDERS, FILES } = require('./lists')

const result = {}

console.log('\nnpm analyze current folder')
const spinner = ora(chalk.gray('looking at stuff ... ')).start()

result['Dependencies in package.json'] = getDepCount()

const extraFiles = new Collector('extraFiles')
const folders = new Collector('folders')
const modules = new Collector('modules')

const folderPaths = []
const filePaths = []

const ignoreFunc = (file, stats) => {
  if (stats.isDirectory()) {
    folders.add(path.basename(file))
    if (FOLDERS.includes(path.basename(file))) {
      folderPaths.push(file)
    }
  }

  const fileBaseName = path.basename(file)

  const parentBaseName = path.basename(file.replace(new RegExp(`/${escapeStringRegexp(fileBaseName)}$`), ''))
  const isScope = (parentBaseName === 'node_modules' || parentBaseName.substr(0, 1) === '@')
  const notDotfile = fileBaseName.substr(0, 1) !== '.'

  if (stats.isDirectory() && isScope && notDotfile) {
    modules.add(fileBaseName)
  }

  if (!stats.isDirectory() && FILES.includes(fileBaseName)) {
    extraFiles.add(fileBaseName)
    filePaths.push(file)
  }

  return false
}

(async () => {
  try {
    await recureaddir('./node_modules', [ignoreFunc])
  } catch (e) {
    console.log('recursive-readdir error')
    console.log(e)
  }

  const npmSize = await sumSize(['./node_modules'])

  const folderSize = await sumSize(folderPaths)
  const fileSize = await sumSize(filePaths)

  result['Total module count'] = modules.count()
  result['Total node_modules size'] = humanFormat(npmSize)
  result['Unused folders total size'] = humanFormat(folderSize)
  result['Unused files total size'] = humanFormat(fileSize)
  result['Average extra weight on each module'] = humanFormat((folderSize + fileSize) / modules.count())

  const results = formatResult(result)

  spinner.stop()

  console.log(columnify(
    results,
    {
      minWidth: 10,
      columns: ['--------------', '------'],
      config: { '------': { align: 'right' } }
    }
  ))

  console.log('\nExtra files top 10')
  console.log('----------------------')
  console.log(columnify(
    extraFiles.topColumnified(10, modules.count()),
    {
      minWidth: 16
    }
  ))

  console.log('\nExtra folders top 10')
  console.log('----------------------')
  console.log(columnify(
    folders.topColumnified(10, modules.count()),
    {
      minWidth: 16
    }
  ))
  console.log('\n')
})()
