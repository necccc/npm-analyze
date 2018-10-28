const columnify = require('columnify')
const formatResult = require('./format-results')

module.exports = (result, ...collections) => {
  const results = formatResult(result)

  console.log(columnify(
    results,
    {
      minWidth: 10,
      columns: ['--------------', '------'],
      config: { '------': { align: 'right' } }
    }
  ))

  collections.forEach((collection) => {
    console.log('\n' + collection.title)
    console.log('----------------------')
    console.log(columnify(
      collection.data,
      {
        minWidth: 16
      }
    ))
  })
}
