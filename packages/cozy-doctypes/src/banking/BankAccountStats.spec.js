const BankAccountStats = require('./BankAccountStats')

describe('BankAccountStats::checkCurrencies', () => {
  it('should return true if the currencies are the same', () => {
    const accountsStats = [
      {
        income: 2000,
        additionalIncome: 400,
        mortgage: 650,
        loans: 800,
        currency: 'EUR'
      },
      {
        income: 1500,
        additionalIncome: 0,
        mortgage: 0,
        loans: 0,
        currency: 'EUR'
      }
    ]

    expect(BankAccountStats.checkCurrencies(accountsStats)).toBe(true)
  })

  it('should return false if the currencies are not the same', () => {
    const accountsStats = [
      {
        income: 2000,
        additionalIncome: 400,
        mortgage: 650,
        loans: 800,
        currency: 'EUR'
      },
      {
        income: 1500,
        additionalIncome: 0,
        mortgage: 0,
        loans: 0,
        currency: 'USD'
      }
    ]

    expect(BankAccountStats.checkCurrencies(accountsStats)).toBe(false)
  })
})
describe('BankAccountStats::sum', () => {
  it('should return the sum of many stats objects', () => {
    const accountsStats = [
      {
        income: 2000,
        additionalIncome: 400,
        mortgage: 650,
        loans: 800,
        fixedCharges: 100,
        currency: 'EUR'
      },
      {
        income: 1500,
        additionalIncome: 0,
        mortgage: 0,
        loans: 0,
        fixedCharges: 100,
        currency: 'EUR'
      }
    ]

    expect(BankAccountStats.sum(accountsStats)).toEqual({
      income: 3500,
      additionalIncome: 400,
      mortgage: 650,
      loans: 800,
      fixedCharges: 200,
      currency: 'EUR'
    })
  })

  it('should return 0 for a missing property', () => {
    const accountsStats = [
      {
        income: 2000,
        additionalIncome: 400,
        mortgage: 650,
        loans: 800,
        currency: 'EUR'
      },
      {
        income: 1500,
        additionalIncome: 0,
        mortgage: 0,
        loans: 0,
        currency: 'EUR'
      }
    ]

    const sum = BankAccountStats.sum(accountsStats)

    expect(sum.fixedCharges).toBe(0)
  })

  it('should throw an error if the stats currencies are not the same', () => {
    const accountsStats = [
      {
        income: 2000,
        additionalIncome: 400,
        mortgage: 650,
        loans: 800,
        currency: 'EUR'
      },
      {
        income: 1500,
        additionalIncome: 0,
        mortgage: 0,
        loans: 0,
        currency: 'USD'
      }
    ]

    expect(() => BankAccountStats.sum(accountsStats)).toThrow()
  })

  it('should throw an error if the given array is empty', () => {
    expect(() => BankAccountStats.sum([])).toThrow()
  })
})
