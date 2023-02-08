const { getSlugFromInstitutionLabel } = require('./slug-account')

it('should find the slug from the institutionLabel', () => {
  expect(getSlugFromInstitutionLabel("Caisse d'Épargne Particuliers")).toBe(
    'caissedepargne1'
  )
  expect(getSlugFromInstitutionLabel('Crédit Mutuel de Bretagne')).toBe('cic45')
  expect(getSlugFromInstitutionLabel()).toBeUndefined()
})
