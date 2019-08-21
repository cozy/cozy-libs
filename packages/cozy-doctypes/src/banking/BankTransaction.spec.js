const BankTransaction = require('./BankTransaction')

const testTransactions = [
  {
    amount: -10,
    originalBankLabel: 'Test 01',
    date: '2018-10-02'
  },
  {
    amount: -20,
    originalBankLabel: 'Test 02',
    date: '2018-10-05'
  },
  {
    amount: -30,
    originalBankLabel: 'Test 03',
    date: '2018-10-06'
  }
]

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

describe('split date', () => {
  it('should be the most recent date present in the transaction', () => {
    expect(BankTransaction.getSplitDate(testTransactions)).toBe('2018-10-06')
  })

  it('should not consider future transactions', () => {
    // Exceptionally, some transactions can come from the future
    // For example in the case of planned stock sale
    // https://trello.com/c/KK9CeQzB/
    expect(
      BankTransaction.getSplitDate([
        ...testTransactions,
        {
          ...testTransactions[0],
          date: '2050-10-06' // Someone planned a transaction in the future
        }
      ])
    ).toBe('2018-10-06')
  })
})

describe('reconciliation', () => {
  const existingTransactions = testTransactions

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

  it('should not return older missed transactions', () => {
    const newTransactions = [
      {
        amount: -10,
        originalBankLabel: 'Test 01',
        date: '2018-10-02'
      },
      {
        amount: -15,
        originalBankLabel: 'Test 04',
        date: '2018-09-26'
      }
    ]

    const missedTransactions = BankTransaction.getMissedTransactions(
      newTransactions,
      existingTransactions
    )

    expect(missedTransactions).toEqual([])
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

  it('should send event for split date', () => {
    const newTransactions = [
      {
        amount: -15,
        originalBankLabel: 'Test 04',
        date: '2018-10-01'
      }
    ]

    const trackEvent = jest.fn()
    BankTransaction.reconciliate(newTransactions, existingTransactions, {
      trackEvent
    })
    expect(trackEvent).toHaveBeenCalledWith({
      e_a: 'ReconciliateSplitDate'
    })
  })
})

describe('BankTransaction.getCategoryId', () => {
  it("Should return the manualCategoryId if there's one", () => {
    const transaction = {
      manualCategoryId: '200110',
      automaticCategoryId: '200120',
      localCategoryId: '200130',
      localCategoryProba: BankTransaction.LOCAL_MODEL_USAGE_THRESHOLD + 0.01
    }

    const options = { localModelOverride: true }

    expect(BankTransaction.getCategoryId(transaction, options)).toBe(
      transaction.manualCategoryId
    )
  })

  it('Should return the automaticCategoryId if the localCategoryProba is lower than the threshold', () => {
    const transaction = {
      automaticCategoryId: '200120',
      localCategoryId: '200130',
      localCategoryProba: BankTransaction.LOCAL_MODEL_USAGE_THRESHOLD - 0.01
    }

    const options = { localModelOverride: true }

    expect(BankTransaction.getCategoryId(transaction, options)).toBe(
      transaction.automaticCategoryId
    )
  })

  it("Should return the automaticCategoryId if there's no manualCategoryId, and localCategory/cozyCategory are not usable", () => {
    const transaction = {
      automaticCategoryId: '200120',
      localCategoryId: '200130',
      localCategoryPrba: BankTransaction.LOCAL_MODEL_USAGE_THRESHOLD - 0.01,
      cozyCategoryId: '200140',
      cozyCategoryProba: BankTransaction.GLOBAL_MODEL_USAGE_THRESHOLD - 0.01
    }

    const options = { localModelOverride: true }

    expect(BankTransaction.getCategoryId(transaction, options)).toBe(
      transaction.automaticCategoryId
    )
  })

  it('Should use local model properties according to `localModelOverride` option', () => {
    const transaction = {
      automaticCategoryId: '200120',
      localCategoryId: '200130',
      localCategoryProba: BankTransaction.LOCAL_MODEL_USAGE_THRESHOLD + 0.01
    }

    expect(
      BankTransaction.getCategoryId(transaction, { localModelOverride: true })
    ).toBe(transaction.localCategoryId)

    expect(
      BankTransaction.getCategoryId(transaction, { localModelOverride: false })
    ).toBe(transaction.automaticCategoryId)
  })

  it('should return the cozyCategoryId if there is one with a high probability, but no localCategoryId', () => {
    const transaction = {
      automaticCategoryId: '200120',
      cozyCategoryId: '200130',
      cozyCategoryProba: BankTransaction.GLOBAL_MODEL_USAGE_THRESHOLD + 0.01
    }

    expect(BankTransaction.getCategoryId(transaction)).toBe(
      transaction.cozyCategoryId
    )
  })

  it('should return null if there is only automaticCategoryId', () => {
    const transaction = {
      automaticCategoryId: '200120'
    }

    expect(BankTransaction.getCategoryId(transaction)).toBeNull()
  })
})
