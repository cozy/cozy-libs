import { getThemeByItem } from './DocumentTypeDataHelpers'

describe('DocumentTypeDataHelpers', () => {
  it('should test getThemeByItem and return defaultTheme', () => {
    const item = {
      label: 'family_record_book',
      purpose: 'attestation',
      sourceCategory: 'gov',
      sourceSubCategory: 'civil_registration',
      subjects: ['family'],
      defaultTheme: 'theme2'
    }
    const theme = getThemeByItem(item)
    expect(theme.id).toBe('theme2')
  })

  it('should test getThemeByItem and return the theme if no defaultTheme', () => {
    const item = {
      label: 'residence_permit',
      purpose: 'attestation',
      sourceCategory: 'gov',
      sourceSubCategory: 'immigration',
      subjects: ['permit', 'identity']
    }
    const theme = getThemeByItem(item)
    expect(theme.id).toBe('theme1')
  })
})
