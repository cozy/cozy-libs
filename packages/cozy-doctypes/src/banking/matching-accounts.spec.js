const fs = require('fs-extra')
const path = require('path')
const {
  matchAccounts,
  normalizeAccountNumber,
  score,
  creditCardMatch,
  approxNumberMatch
} = require('./matching-accounts')

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
    'axa',
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
    'hsbc2',
    'creditmutuel',
    'banquepostale',
    'milleis',
    'banquepostale2',
    'fortuneo2'
  ]
  for (let bank of banks) {
    it(`should correctly match ${bank}`, () => {
      const results = matchFiles(
        path.join(fixturePath, `${bank}.bi.anonymized.json`),
        path.join(fixturePath, `${bank}.linxo.anonymized.json`)
      )
      const fmtedResults = results.map(res =>
        res.match
          ? `✅ ${res.account.label} -> ${res.match.label} via ${res.method}`
          : `⚠️ ${res.account.label} unmatched`
      )
      expect(fmtedResults).toMatchSnapshot()
    })
  }
})

describe('slug match', () => {
  const account = {
    balance: 1337,
    label: 'Test account',
    number: '19019019002',
    type: 'CreditCard',
    institutionLabel: 'Boursorama'
  }

  it('should not match an account with a different slug', () => {
    expect(
      score(account, {
        ...account,
        institutionLabel: 'Bred'
      }).points
    ).toBeLessThan(0)
  })

  it('should match if we cannot determine the slug', () => {
    expect(
      score(account, {
        ...account,
        // Since we cannot determine the slug, it is not
        // counted as a mismatch
        // (does not match with ING since there is a ^ in the regexp)
        institutionLabel: 'Unexisting bank'
      }).points
    ).toBeGreaterThan(0)
  })
})

it('should normalize account number', () => {
  expect(normalizeAccountNumber('LEO-385248377-EUR')).toBe('385248377')
  expect(normalizeAccountNumber('385248377EUR')).toBe('385248377')
  expect(normalizeAccountNumber('')).toBe('')
  expect(normalizeAccountNumber(null)).toBe(null)
  expect(normalizeAccountNumber(undefined)).toBe(undefined)
})

describe('creditCardMatch', () => {
  it('should not throw when an account does not have a number', () => {
    expect(() => creditCardMatch({}, {})).not.toThrow()
    // real paypal example
    expect(
      creditCardMatch(
        {
          balance: 0,
          comingBalance: 0,
          currency: 'EUR',
          label: 'xxx EUR PERSONAL',
          metadata: {
            dateImport: '2020-11-04T18:06:57.857Z',
            vendor: 'budget-insight',
            version: 1,
            updatedAt: '2020-11-04T18:45:42'
          },
          shortLabel: 'xxx EUR PERSONAL',
          type: 'Checkings',
          vendorId: '230',
          institutionLabel: 'Paypal REST API'
        },
        { number: '13002900002', type: 'CreditCard' }
      )
    ).toBe(false)
  })
})

describe('approxNumberMatch', () => {
  it('should not match when one of the number is too short', () => {
    expect(
      approxNumberMatch(
        {
          number: '90'
        },
        {
          number: '01234567890'
        }
      )
    ).toBe(false)
    expect(
      approxNumberMatch(
        {
          number: '7890'
        },
        {
          number: '01234567890'
        }
      )
    ).toBe(true)
  })
})
