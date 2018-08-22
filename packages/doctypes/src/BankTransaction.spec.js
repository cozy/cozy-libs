const BankTransaction = require('./BankTransaction')

describe('transaction reconciliation', () => {
  it('should be able to filter incoming linxo transactions on their date', () => {
    const filter = x => BankTransaction.prototype.isAfter.call(x, '2018-10-04')
    expect(filter({ date: new Date('2018-10-03').toISOString() })).toBe(false) // midnight
    expect(filter({ date: new Date('2018-10-02').toISOString() })).toBe(false) // day before
    expect(filter({ date: new Date('2018-10-05').toISOString() })).toBe(true) // day after
  })
})
