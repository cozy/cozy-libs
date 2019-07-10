import { roundCurrencyAmount } from './currency'

describe('roundCurrencyAmount', () => {
  it('should return the rounded amount with a precision corresponding to the given currency', () => {
    const amount = 1234.566666
    const currency = 'EUR'

    expect(roundCurrencyAmount(amount, currency)).toBe(1234.57)
  })

  it('should fallback on a 2 decimals precision if the currency is unknown', () => {
    const amount = 1234.566666
    const currency = 'BROUZOUF'

    expect(roundCurrencyAmount(amount, currency)).toBe(1234.57)
  })
})
