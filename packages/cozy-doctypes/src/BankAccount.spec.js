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
    expect(matchedAccounts[0]._id).toBe('a1')
    expect(matchedAccounts[1]._id).toBe(undefined)
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
