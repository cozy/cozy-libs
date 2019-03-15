const { getSlugFromInstitutionLabel } = require('./slug-account')

it('should find the slug from the institutionLabel', () => {
  expect(getSlugFromInstitutionLabel("caisse d'Épargne (particuliers)")).toBe(
    'caissedepargne1'
  )
  expect(
    getSlugFromInstitutionLabel('Crédit Mutuel de Montigny Lengrain')
  ).toBe('cic45')
  expect(getSlugFromInstitutionLabel()).toBeUndefined()
})
