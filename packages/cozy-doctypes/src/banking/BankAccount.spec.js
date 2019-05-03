const BankAccount = require('./BankAccount')

describe('account reconciliation', () => {
  it('should correctly match linxo accounts to cozy accounts through number', () => {
    const localAccounts = [{ _id: 'a1', number: '1', balance: 50 }]
    const remoteAccounts = [
      { number: '1', balance: 100 },
      { number: '2', balance: 200 }
    ]
    const matchedAccounts = BankAccount.reconciliate(
      remoteAccounts,
      localAccounts
    )
    expect(matchedAccounts.find(x => x.number === '1')._id).toBe('a1')
    expect(matchedAccounts.find(x => x.number !== '1')._id).toBe(undefined)
    expect(matchedAccounts.length).toBe(2)
  })
})

describe('deleteDuplicateBankAccountsWithNoOperations', () => {
  it('should return duplicate with no operations', () => {
    const res = BankAccount.findDuplicateAccountsWithNoOperations(
      [
        { _id: 'empty', label: 'Duplicate account' },
        { _id: 'filled', label: 'Duplicate account' },
        { _id: 'filled_not_duplicate', label: 'Account with ops' },
        {
          _id: 'duplicate_across_institution',
          institutionLabel: 'Bank 1',
          label: 'Duplicate across institution'
        },
        {
          _id: 'duplicate_across_institution',
          institutionLabel: 'Bank 2',
          label: 'Duplicate across institution'
        }
      ],
      [
        { _id: 'op1', account: 'filled' },
        { _id: 'op2', account: 'filled' },
        { _id: 'op3', account: 'filled' },
        { _id: 'op4', account: 'filled' },
        { _id: 'op5', account: 'filled_not_duplicate' },
        { _id: 'op6', account: 'filled_not_duplicate' },
        { _id: 'op7', account: 'filled_not_duplicate' }
      ]
    )

    expect(res.map(x => x._id)).toEqual(['empty'])
  })
})

describe('incoherences', () => {
  const incoherent = {
    institutionLabel: "Caisse d'épargne",
    cozyMetadata: {
      createdByApp: 'boursorama'
    }
  }

  const coherent = {
    institutionLabel: "Caisse d'épargne",
    cozyMetadata: {
      createdByApp: 'caissedepargne1'
    }
  }

  const unknown = {
    institutionLabel: 'Unknown bank',
    cozyMetadata: {
      createdByApp: 'unknown1337'
    }
  }

  const noMetadata = {
    institutionLabel: "Caisse d'épargne"
  }

  const noCreatedByApp = {
    institutionLabel: "Caisse d'épargne",
    cozyMetadata: {}
  }

  it('should detect when slug is not coherent with createdByApp', () => {
    expect(BankAccount.hasIncoherentCreatedByApp(incoherent)).toBe(true)
    expect(BankAccount.hasIncoherentCreatedByApp(coherent)).toBe(false)
    expect(BankAccount.hasIncoherentCreatedByApp(unknown)).toBe(false)
    expect(BankAccount.hasIncoherentCreatedByApp(noMetadata)).toBe(false)
    expect(BankAccount.hasIncoherentCreatedByApp(noCreatedByApp)).toBe(false)
  })
})

describe('getUpdatedAt', () => {
  let account

  beforeEach(() => {
    account = {
      metadata: {
        updatedAt: '2019-05-01T16:09:00'
      },
      cozyMetadata: {
        updatedAt: '2019-05-02T15:36:00'
      }
    }
  })

  it("should return metadata.updatedAt if it's defined", () => {
    expect(BankAccount.getUpdatedAt(account)).toBe('2019-05-01T16:09:00')
  })

  it('should return cozyMetadata.updatedAt if metadata.updatedAt is not defined', () => {
    delete account.metadata

    expect(BankAccount.getUpdatedAt(account)).toBe('2019-05-02T15:36:00')
  })

  it('should return null if neither cozyMetadata.updatedAt nor metadata.updatedAt is defined', () => {
    expect(BankAccount.getUpdatedAt({})).toBe(null)
  })
})
