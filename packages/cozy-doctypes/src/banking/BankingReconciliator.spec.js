const BankingReconciliator = require('./BankingReconciliator')
const { Document, BankAccount, BankTransaction } = require('..')

describe('banking reconciliator', () => {
  let reconciliator

  let existingAccounts, existingTransactions

  beforeEach(() => {
    let _id = 1
    BankAccount.fetchAll = jest
      .fn()
      .mockImplementation(() => Promise.resolve(existingAccounts))
    Document.createOrUpdate = jest
      .fn()
      .mockImplementation(attrs => Promise.resolve({ ...attrs, _id: _id++ }))
    BankTransaction.fetchAll = jest
      .fn()
      .mockImplementation(() => Promise.resolve(existingTransactions))
    reconciliator = new BankingReconciliator({ BankAccount, BankTransaction })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const fmtCreateOrUpdateCall = call => {
    const doc = call[0]
    return doc.label
  }

  it('should correctly reconciliate when accounts do not exist', async () => {
    existingAccounts = []
    existingTransactions = []
    await reconciliator.save(
      [
        {
          vendorId: 1,
          balance: 1000,
          label: 'Bank account 1'
        }
      ],
      [
        {
          amount: -100,
          label: 'Debit 100',
          vendorAccountId: 1,
          date: '2018-06-27T00:00'
        }
      ]
    )
    expect(Document.createOrUpdate).toHaveBeenCalledTimes(2)
  })

  it('should correctly reconciliate when accounts exist', async () => {
    existingAccounts = [
      {
        vendorId: 1,
        number: '1',
        _id: 123,
        balance: 2000,
        label: 'Bank account 1'
      }
    ]
    existingTransactions = [
      {
        vendorAccountId: 1,
        vendorId: 123,
        date: '2018-06-25T00:00',
        label: 'Debit 200',
        amount: -200
      }
    ]
    await reconciliator.save(
      [
        {
          number: '1', // existing account
          vendorId: 2, // from a new connector account
          balance: 1000,
          label: 'Bank account 1'
        },
        {
          number: '1', // Same number as above, but the existing account
          vendorId: 2, // has already been matched, so this account
          balance: 1000, // will be saved
          label: 'Bank account 1 - Titres'
        }
      ],
      [
        {
          amount: -200,
          label: 'Debit 200',
          vendorAccountId: 2,
          date: '2018-06-24T00:00' // prior to split date and doesn't exist, saved
        },
        {
          amount: -100,
          label: 'Debit 100',
          vendorAccountId: 2,
          date: '2018-06-27T00:00'
        }
      ]
    )
    expect(Document.createOrUpdate).toHaveBeenCalledTimes(4)
    expect(
      Document.createOrUpdate.mock.calls.map(fmtCreateOrUpdateCall)
    ).toMatchSnapshot()
  })

  it('should pass stack transactions belonging to reconciliated accounts to BankTransaction::reconciliate', async () => {
    existingAccounts = [
      {
        vendorId: 1,
        number: '1',
        _id: 123,
        balance: 2000,
        label: 'Bank account 1'
      },
      {
        vendorId: 1,
        number: '1337',
        _id: 124,
        balance: 2000,
        label: 'Bank account 2 from another konnector'
      }
    ]
    existingTransactions = [
      {
        vendorAccountId: 1,
        vendorId: 123,
        date: '2018-06-25T00:00',
        label: 'Debit 200',
        amount: -200,
        account: 123
      },
      {
        vendorAccountId: 1,
        vendorId: 124,
        date: '2018-06-25T00:00',
        label: 'Debit 200',
        amount: -200,
        account: 123
      },
      {
        vendorAccountId: 2,
        vendorId: 125,
        date: '2018-06-25T00:00',
        label: 'Debit 300 from another konnector',
        amount: -300,
        account: 124
      }
    ]
    jest.spyOn(BankTransaction, 'reconciliate')
    const fetchedAccounts = [
      {
        number: '1', // existing account
        vendorId: 2, // from a new connector account
        balance: 1000,
        label: 'Bank account 1'
      }
    ]
    const fetchedTransactions = [
      {
        amount: -400,
        label: 'Debit 400',
        vendorAccountId: 2,
        date: '2018-06-22T00:00' // prior to split date and doesn't exist, saved
      },
      {
        amount: -100,
        label: 'Debit 100',
        vendorAccountId: 2,
        date: '2018-06-27T00:00'
      }
    ]
    await reconciliator.save(fetchedAccounts, fetchedTransactions)
    expect(BankTransaction.reconciliate).toHaveBeenCalledWith(
      fetchedTransactions,
      [existingTransactions[0], existingTransactions[1]],
      {}
    )
    expect(
      Document.createOrUpdate.mock.calls.map(fmtCreateOrUpdateCall)
    ).toMatchSnapshot()
  })
})
