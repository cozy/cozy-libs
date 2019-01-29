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
      originalBankLabel: 'Test getIdentifier',
      date: '2018-10-02',
      currency: 'EUR'
    }

    const identifier = BankTransaction.prototype.getIdentifier.call(transaction)

    expect(identifier).toBe('-10-Test getIdentifier-2018-10-02')
  })
})

describe('reconciliation', () => {
  const existingTransactions = [
    {
      amount: -10,
      originalBankLabel: 'Test 01',
      date: '2018-10-02'
    },
    {
      amount: -20,
      originalBankLabel: 'Test 02',
      date: '2018-10-02'
    },
    {
      amount: -30,
      originalBankLabel: 'Test 03',
      date: '2018-10-02'
    }
  ]

  it('should return the missed transactions when there are some', () => {
    const newTransactions = [
      {
        amount: -10,
        originalBankLabel: 'Test 01',
        date: '2018-10-02'
      },
      {
        amount: -15,
        originalBankLabel: 'Test 04',
        date: '2018-10-06'
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
        originalBankLabel: 'Test 01',
        date: '2018-10-02'
      }
    ]

    const missedTransactions = BankTransaction.getMissedTransactions(
      newTransactions,
      existingTransactions
    )

    expect(missedTransactions).toHaveLength(0)
  })

  it('should send events if trackEvent option is set', () => {
    const newTransactions = [
      {
        amount: -15,
        originalBankLabel: 'Test 04',
        date: '2018-10-01'
      }
    ]

    const trackEvent = jest.fn()
    BankTransaction.getMissedTransactions(
      newTransactions,
      existingTransactions,
      { trackEvent }
    )
    expect(trackEvent).toHaveBeenCalledWith({
      e_a: 'ReconciliateMissing',
      e_n: 'MissedTransactionPct',
      e_v: 0.33
    })
    expect(trackEvent).toHaveBeenCalledWith({
      e_a: 'ReconciliateMissing',
      e_n: 'MissedTransactionAbs',
      e_v: 1
    })
  })

})
