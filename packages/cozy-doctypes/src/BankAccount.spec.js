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
