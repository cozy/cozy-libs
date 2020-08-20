import { getAccountType } from './bankAccountHelpers'

describe('getAccountType', () => {
  it('should map types correctly', () => {
    const accountTypes = {
      Other: ['Unkown', 'None'],
      LongTermSavings: [
        'Article83',
        'LifeInsurance',
        'Madelin',
        'Market',
        'Mortgage',
        'PEA',
        'PEE',
        'Perco',
        'Perp',
        'RSP'
      ],
      Business: ['Asset', 'Capitalisation', 'Liability'],
      Checkings: ['Bank', 'Cash', 'Deposit'],
      Loan: ['ConsumerCredit', 'RevolvingCredit'],
      CreditCard: ['Credit card']
    }

    for (const [mapped, originals] of Object.entries(accountTypes)) {
      for (const original of originals) {
        expect(getAccountType({ type: original })).toBe(mapped)
      }
    }
  })
})
