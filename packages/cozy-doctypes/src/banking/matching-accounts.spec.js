const fs = require('fs-extra')
const path = require('path')
const { matchAccounts, normalizeAccountNumber } = require('./matching-accounts')

const BANK_ACCOUNT_DOCTYPE = 'io.cozy.bank.accounts'
const readBankAccounts = filename =>
  fs.readJSONSync(filename)[BANK_ACCOUNT_DOCTYPE]

const matchFiles = (biFilename, linxoFilename) => {
  return matchAccounts(
    readBankAccounts(biFilename),
    readBankAccounts(linxoFilename)
  )
}

const fixturePath = path.join(__dirname, 'fixtures')

// For these tests to run, you need to decrypt encrypted.tar.gz.gpg
// `yarn run decrypt-banking-tests` in the workspace root
const fnDescribe = fs.existsSync(fixturePath) ? describe : xdescribe
fnDescribe('account matching', () => {
  const banks = [
    'banquepopulaire',
    'banquepopulaire2',
    'ing',
    'boursorama',
    'caissedepargne',
    'creditagricoleaquitaine',
    'fortuneo',
    'hellobank',
    'bnp',
    'hsbc',
    'creditmutuel',
    'banquepostale'
  ]
  for (let bank of banks) {
    it(`should correctly match ${bank}`, () => {
      const results = matchFiles(
        path.join(fixturePath, `${bank}.bi.anonymized.json`),
        path.join(fixturePath, `${bank}.linxo.anonymized.json`)
      )
      const fmtedResults = results.map(
        res =>
          res.match
            ? `✅ ${res.account.label} -> ${res.match.label} via ${res.method}`
            : `⚠️ ${res.account.label} unmatched`
      )
      expect(fmtedResults).toMatchSnapshot()
    })
  }
})

it('should normalize account number', () => {
  expect(normalizeAccountNumber('LEO-385248377-EUR')).toBe('385248377')
  expect(normalizeAccountNumber('385248377EUR')).toBe('385248377')
})
