const fs = require('fs-extra')
const path = require('path')
const { matchTransactions, scoreMatching } = require('./matching-transactions')

const DOCTYPE_OPERATIONS = 'io.cozy.bank.operations'
const readOperations = filename => fs.readJSONSync(filename)[DOCTYPE_OPERATIONS]

const fmtMatchResult = result => {
  const date = result.transaction.date.substr(0, 10)
  if (result.match) {
    return `✅ ${date}: ${result.transaction.label} (${result.transaction.amount}) -> ${result.match.label} (${result.match.amount}) ${
      result.method
    }`
  } else {
    return `❌ ${date}: ${result.transaction.label} ${result.transaction.amount}`
  }
}
const matchFiles = (filename1, filename2) => {
  return matchTransactions(readOperations(filename1), readOperations(filename2))
}

const fixturePath = path.join(__dirname, 'fixtures')

const fnDescribe = fs.existsSync(fixturePath) ? describe : xdescribe

fnDescribe('transactions matching', () => {
  for (let bank of ['banquepostale', 'creditagricole']) {
    it(`should match snapshots for ${bank}`, () => {
      const results = matchFiles(
        path.join(fixturePath, `${bank}-transactions.bi.json`),
        path.join(fixturePath, `${bank}-transactions.linxo.json`)
      )
      const fmtedResults = Array.from(results).map(fmtMatchResult)
      expect(fmtedResults).toMatchSnapshot()
    })
  }
})

it('should score', () => {
  const newTr = {
    "amount": -85,
    "date": "2018-09-22T12:00:00.000Z",
    "label": "Web Sylvain Miserenne G",
    "originalBankLabel": "Virement Web Sylvain Miserenne Courses G Courses Gard 24/09/2018",
  }
  const existingTr = {
    "amount": -85,
    "date": "2018-09-22T00:00:00+02:00",
    "label": "Sylvain Miserenne Courses Gard 22/09/2018",
    "linxoId": "1209279242",
    "originalBankLabel": "Virement Web Sylvain Miserenne Courses G Courses Gard 22/09/2018"
  }
  const scoreResult = scoreMatching(newTr, existingTr)
  // Even if both labels and originalBankLabels are different, these
  // transactions are very similar and when scored within the same day, they should be matched
  expect(scoreResult.points).toBeGreaterThan(0)
})
