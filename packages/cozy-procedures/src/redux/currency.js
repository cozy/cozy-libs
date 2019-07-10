import round from 'lodash/round'

export const roundCurrencyAmount = (amount, currency) => {
  const currencyToRoundingPrecision = {
    EUR: 2
  }

  const precision = currencyToRoundingPrecision[currency] || 2

  return round(amount, precision)
}
