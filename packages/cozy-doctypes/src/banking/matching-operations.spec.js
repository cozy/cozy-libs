const fs = require('fs-extra')
const path = require('path')
const { matchOperations } = require('./matching-operations')

const DOCTYPE_OPERATIONS = 'io.cozy.bank.operations'
const readOperations = filename => fs.readJSONSync(filename)[DOCTYPE_OPERATIONS]

const fmtMatchResult = result => {
  const date = result.operation.date.substr(0, 10)
  if (result.match) {
    return `✅ ${date}: ${result.operation.label} -> ${result.match.label} ${
      result.method
    }`
  } else {
    return `❌ ${date}: ${result.operation.label} ${result.operation.amount}`
  }
}
const matchFiles = (filename1, filename2) => {
  return matchOperations(readOperations(filename1), readOperations(filename2))
}

const fixturePath = path.join(__dirname, 'fixtures')

const fnDescribe = fs.existsSync(fixturePath) ? describe : xdescribe

fnDescribe('operations matching', () => {
  for (let bank of ['banquepostale']) {
    it(`should match snapshots for ${bank}`, () => {
      const results = matchFiles(
        path.join(fixturePath, `${bank}-operations.bi.json`),
        path.join(fixturePath, `${bank}-operations.linxo.json`)
      )
      const fmtedResults = Array.from(results).map(fmtMatchResult)
      expect(fmtedResults).toMatchSnapshot()
    })
  }
})
