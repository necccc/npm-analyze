const analyzeDeps = require('../lib/analyze-deps')
const analyzeProject = require('../lib/analyze-project')

module.exports.analyzeDeps = async function () {
  return analyzeDeps({ returnOnly: true })
}

module.exports.analyze = async function () {
  return analyzeProject({ returnOnly: true })
}

// prepublishOnly hook
