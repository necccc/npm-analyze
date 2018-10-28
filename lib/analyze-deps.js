const path = require('path')
const humanFormat = require('human-format')
const chalk = require('chalk')
const escapeStringRegexp = require('escape-string-regexp')
const ora = require('ora')

const getDepCount = require('./get-dep-count')
const recureaddir = require('./recursive-readdir')
const sumSize = require('./size-summary')
const Collector = require('./collector')
const printOutput = require('./print-output')

const { FOLDERS, FILES } = require('./lists')

module.exports = async ({ jsonOutput }) => {
  const result = {}
  const files = new Collector('extraFiles')
  const folders = new Collector('folders')
  const modules = new Collector('modules')

  let spinner

  if (!jsonOutput) {
    console.log('\nnpm analyze current folder')
    spinner = ora(chalk.gray('looking at stuff ... ')).start()
  }

  result.dependencyCount = getDepCount()

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
      filePaths.push(file)
    }

    if (!stats.isDirectory()) {
      files.add(fileBaseName)
    }

    return false
  }

  try {
    await recureaddir('./node_modules', [ignoreFunc])
  } catch (e) {
    console.log('recursive-readdir error')
    console.log(e)
  }

  const npmSize = await sumSize(['./node_modules'])
  const folderSize = await sumSize(folderPaths)
  const fileSize = await sumSize(filePaths)
  const totalModuleCount = modules.count()

  result.totalModuleCount = totalModuleCount
  result.nodeModuleSize = humanFormat(npmSize)
  result.unusedFolderSize = humanFormat(folderSize)
  result.unusedFileSize = humanFormat(fileSize)
  result.averageOverheadPerModule = humanFormat((folderSize + fileSize) / totalModuleCount)

  if (jsonOutput) {
    const data = Object.assign({}, result, { files: files.raw() }, { folders: folders.raw() })
    console.log(JSON.stringify(data))
    return
  }

  spinner.stop()

  printOutput(
    result,
    {
      title: 'Files top 10',
      data: files.topColumnified(10)
    },
    {
      title: 'Folders top 10',
      data: folders.topColumnified(10)
    }
  )
}
