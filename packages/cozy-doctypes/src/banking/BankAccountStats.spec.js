const BankAccountStats = require('./BankAccountStats')

describe('BankAccountStats::sum', () => {
  it('should return the sum of many stats objects', () => {
    const accountsStats = [
      {
        income: 2000,
        additionalIncome: 400,
        mortgage: 650,
        loans: 800
      },
      {
        income: 1500,
        additionalIncome: 0,
        mortgage: 0,
        loans: 0
      }
    ]

    expect(BankAccountStats.sum(accountsStats)).toEqual({
      income: 3500,
      additionalIncome: 400,
      mortgage: 650,
      loans: 800
    })
  })
})
