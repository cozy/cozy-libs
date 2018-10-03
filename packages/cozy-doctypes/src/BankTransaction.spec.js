const BankTransaction = require('./BankTransaction')

describe('transaction reconciliation', () => {
  it('should be able to filter incoming linxo transactions on their date', () => {
    const filter = x => BankTransaction.prototype.isAfter.call(x, '2018-10-04')
    expect(filter({ date: new Date('2018-10-03').toISOString() })).toBe(false) // midnight
    expect(filter({ date: new Date('2018-10-02').toISOString() })).toBe(false) // day before
    expect(filter({ date: new Date('2018-10-05').toISOString() })).toBe(true) // day after
  })
})

describe('getIdentifier', () => {
  it('should return the identifier of a transaction', () => {
    const transaction = {
      amount: -10,
      originalLabel: 'Test getIdentifier',
      date: '2018-10-02',
      currency: 'EUR'
    }

    const identifier = BankTransaction.prototype.getIdentifier.call(transaction)

    expect(identifier).toBe('-10-Test getIdentifier-2018-10-02')
  })
})

describe('alreadyExists', () => {
  const existingTransactions = [
    {
      amount: -10,
      originalLabel: 'Test 01',
      date: '2018-10-02'
    },
    {
      amount: -20,
      originalLabel: 'Test 02',
      date: '2018-10-02'
    },
    {
      amount: -30,
      originalLabel: 'Test 03',
      date: '2018-10-02'
    }
  ]

  it('should return true if the transaction exists', () => {
    const transaction = {
      amount: -10,
      originalLabel: 'Test 01',
      date: '2018-10-02'
    }

    const exists = BankTransaction.prototype.alreadyExists.call(
      transaction,
      existingTransactions
    )

    expect(exists).toBe(true)
  })

  it('should return false if the transaction does not exist', () => {
    const transaction = {
      amount: -50,
      originalLabel: 'Not existing',
      date: '2018-10-02'
    }

    const exists = BankTransaction.prototype.alreadyExists.call(
      transaction,
      existingTransactions
    )

    expect(exists).toBe(false)
  })
})

describe('getMissedTransactions', () => {
  const existingTransactions = [
    {
      amount: -10,
      originalLabel: 'Test 01',
      date: '2018-10-02'
    },
    {
      amount: -20,
      originalLabel: 'Test 02',
      date: '2018-10-02'
    },
    {
      amount: -30,
      originalLabel: 'Test 03',
      date: '2018-10-02'
    }
  ]

  it('should return the missed transactions when there are some', () => {
    const newTransactions = [
      {
        amount: -10,
        originalLabel: 'Test 01',
        date: '2018-10-02'
      },
      {
        amount: -15,
        originalLabel: 'Test 04',
        date: '2018-10-01'
      }
    ]

    const missedTransactions = BankTransaction.getMissedTransactions(
      newTransactions,
      existingTransactions
    )

    expect(missedTransactions).toEqual([newTransactions[1]])
  })

  it('should return an empty array when there is no missed transaction', () => {
    const newTransactions = [
      {
        amount: -10,
        originalLabel: 'Test 01',
        date: '2018-10-02'
      }
    ]

    const missedTransactions = BankTransaction.getMissedTransactions(
      newTransactions,
      existingTransactions
    )

    expect(missedTransactions).toHaveLength(0)
  })
})
