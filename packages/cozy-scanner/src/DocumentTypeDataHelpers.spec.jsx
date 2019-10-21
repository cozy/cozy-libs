import { getItemsByCategory, getThemeByItem } from './DocumentTypeDataHelpers'

describe('DocumentTypeDataHelpers', () => {
  it('should test getItemByCategory', () => {
    const items = getItemsByCategory({ label: 'identity' })
    expect(items.length).toBe(6)
  })
  it('should return null if no cate with this label', () => {
    const items = getItemsByCategory('')
    expect(items).toBeNull()
  })

  it('should test getThemeByItem and return defaultTheme', () => {
    const item = {
      id: '4',
      classification: 'identity_document',
      subClassification: 'family_record_book',
      label: 'family_record_book',
      defaultTheme: 'theme2'
    }
    const theme = getThemeByItem(item)
    expect(theme.id).toBe('theme2')
  })

  it('should test getThemeByItem and return the theme if no defaultTheme', () => {
    const item = {
      id: '3',
      classification: 'identity_document',
      subClassification: 'residence_permit',
      label: 'residence_permit'
    }
    const theme = getThemeByItem(item)
    expect(theme.id).toBe('theme1')
  })
})
