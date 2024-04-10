/* eslint-disable node/no-unsupported-features/es-syntax */
const path = require('path')

const fs = require('fs-extra')

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

describe('no "number" attribute match', () => {
  const acc = {
    id: 1337,
    balance: 1337,
    label: 'Test account',
    number: null,
    type: 'pee',
    institutionLabel: "Plan·d'Epargne·Entreprise"
  }

  it('should not match the same account (id) without number attribute', () => {
    const newAcc = {
      ...acc,
      id: 1234
    }

    expect(score(acc, newAcc).points).toBeLessThan(0)
  })

  it('should match even if there are not the same id', () => {
    const acc1 = {
      ...acc,
      id: 1234,
      number: '13371337133'
    }
    const acc2 = {
      ...acc,
      id: 1337,
      number: '13371337133'
    }

    expect(score(acc1, acc2).points).toBeGreaterThan(0)
  })

  it('should not match even if there are same id', () => {
    const acc1 = {
      ...acc,
      id: 1234,
      number: '13371337133'
    }
    const acc2 = {
      ...acc,
      id: 1234,
      number: '12341234123'
    }

    expect(score(acc1, acc2).points).toBeLessThan(0)
  })

  it('should match the same account (id) without number attribute', () => {
    const acc2 = {
      ...acc,
      id: 1337,
      number: null
    }
    expect(score(acc, acc2).points).toBeGreaterThan(0)
  })
})

it('should normalize account number', () => {
  expect(normalizeAccountNumber('LEO-385248377-EUR')).toBe('385248377')
  expect(normalizeAccountNumber('385248377EUR')).toBe('385248377')
  expect(normalizeAccountNumber('')).toBe('')
  expect(normalizeAccountNumber(null)).toBe(null)
  expect(normalizeAccountNumber(undefined)).toBe(undefined)
  expect(normalizeAccountNumber('xxxx xxxx xxxx 1234')).toBe(
    'xxxx xxxx xxxx 1234'
  )
  expect(normalizeAccountNumber('****-****-****-1234')).toBe(
    '****-****-****-1234'
  )
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
  it('should parse correctly redacted number with x and *', () => {
    expect(
      creditCardMatch(
        {
          number: '****-****-****-1234',
          type: 'CreditCard'
        },
        { number: '1234', type: 'CreditCard' }
      )
    ).toBe(true)
    expect(
      creditCardMatch(
        {
          number: 'xxxx xxxx xxxx 1234',
          type: 'CreditCard'
        },
        { number: '1234', type: 'CreditCard' }
      )
    ).toBe(true)
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

describe('matchAccounts', () => {
  it('should ignore disabled accounts if no matching accounts', () => {
    const fetchedAccounts = [{ metadata: { disabledAt: '2022-07-26' } }]
    const existingAccounts = []
    const result = matchAccounts(fetchedAccounts, existingAccounts)
    expect(result).toEqual([])
  })
  it('should update an enabled account if fetched account is disabled', () => {
    const fetchedAccounts = [{ metadata: { disabledAt: '2022-07-26' } }]
    const existingAccounts = [{ metadata: { disabledAt: null } }]
    const result = matchAccounts(fetchedAccounts, existingAccounts)
    expect(result).toEqual([
      {
        account: {
          metadata: {
            disabledAt: '2022-07-26'
          }
        },
        match: {
          metadata: {
            disabledAt: null
          }
        },
        method: 'no-number-attr-same-type'
      }
    ])
  })
  it('should update enabled accounts as usual', () => {
    const fetchedAccounts = [
      { newAttr: 'value', metadata: { disabledAt: null } }
    ]
    const existingAccounts = [{ metadata: { disabledAt: null } }]
    const result = matchAccounts(fetchedAccounts, existingAccounts)
    expect(result).toEqual([
      {
        account: {
          newAttr: 'value',
          metadata: {
            disabledAt: null
          }
        },
        match: {
          metadata: {
            disabledAt: null
          }
        },
        method: 'no-number-attr-same-type'
      }
    ])
  })
})
