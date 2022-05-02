export const filterPapersByTheme = (files, theme) => {
  if (!theme) return files

  return files.filter(file =>
    theme.items.some(item => item.label === file.metadata.qualification.label)
  )
}
