import { themes, items } from './DocumentTypeData'

export const getItemById = id => {
  return items.find(item => item.id === id)
}

export const getThemeByItem = item => {
  if (item.defaultTheme) {
    return themes.find(theme => theme.id === item.defaultTheme)
  }
  return themes.find(theme => theme.file_type_ids.includes(item.id))
}

const flattenedItemsInThemes = () => {
  const flattened = []
  themes.map(theme => {
    flattened[theme.label] = []
    flattened[theme.label].push(theme)
    flattened[theme.label].items = []
    theme.file_type_ids.map(itemId => {
      flattened[theme.label].items.push(getItemById(itemId))
    })
  })
  return flattened
}

// We flatten arrays at runtime to be easier to read
const flattened = flattenedItemsInThemes()

export const getItemsByCategory = ({ label }) => {
  return flattened[label].items
}
