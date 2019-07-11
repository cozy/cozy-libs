import round from 'lodash/round'

export const roundCurrencyAmount = (amount, currency) => {
  const currencyToRoundingPrecision = {
    EUR: 2
  }

  let precision = currencyToRoundingPrecision[currency]

  if (precision === undefined) {
    console.warn('Default currency rounding precision has been used')
    precision = 2
  }

  return round(amount, precision)
}
