import bankAccountFixture from './bank-account-fixture.json'
import {
  getAccountInstitutionLabel,
  getAccountLabel
} from './bankAccountHelpers'

test('helpers', () => {
  expect(getAccountInstitutionLabel(bankAccountFixture)).toEqual(
    "Caisse d'Épargne Particuliers"
  )
  expect(getAccountLabel(bankAccountFixture)).toEqual('Mon compte sociétaire')
})
