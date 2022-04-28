// should be in cozy-client : https://github.com/cozy/cozy-client/blob/master/packages/cozy-client/src/models/document/documentTypeDataHelpers.js
export const hasItemByLabel = (theme, label) =>
  theme.items.some(item => item.label === label)

export const filterPapersByTheme = (files, theme) => {
  if (!theme) return files

  return files.filter(file =>
    hasItemByLabel(theme, file.metadata.qualification.label)
  )
}
