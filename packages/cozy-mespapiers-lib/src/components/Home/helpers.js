import Fuse from 'fuse.js'

const fuse = new Fuse([], {
  findAllMatches: true,
  threshold: 0.3,
  ignoreLocation: true,
  ignoreFieldNorm: true,
  keys: [
    {
      name: 'name'
    }
  ]
})

// TODO: hasItemByLabel should be in cozy-client : https://github.com/cozy/cozy-client/blob/master/packages/cozy-client/src/models/document/documentTypeDataHelpers.js
export const hasItemByLabel = (theme, label) => {
  if (!theme) return true
  return theme.items.some(item => item.label === label)
}

export const filterPapersByThemeAndSearchValue = ({ files, theme, search }) => {
  let filteredFiles = files

  if (search) {
    fuse.setCollection(files)
    filteredFiles = fuse.search(search).map(result => result.item)
  }

  if (theme) {
    filteredFiles = filteredFiles.filter(file =>
      hasItemByLabel(theme, file.metadata.qualification.label)
    )
  }

  return filteredFiles
}
