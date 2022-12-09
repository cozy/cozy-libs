import Fuse from 'fuse.js'

const fuse = new Fuse([], {
  findAllMatches: true,
  threshold: 0.3,
  ignoreLocation: true,
  ignoreFieldNorm: true,
  keys: ['name', 'translatedQualificationLabel', 'contact']
})

// TODO: hasItemByLabel should be in cozy-client : https://github.com/cozy/cozy-client/blob/master/packages/cozy-client/src/models/document/documentTypeDataHelpers.js
export const hasItemByLabel = (theme, label) => {
  if (!theme) return true
  return theme.items.some(item => item.label === label)
}

export const filterPapersByThemeAndSearchValue = ({
  files,
  theme,
  search,
  scannerT
}) => {
  let filteredFiles = files

  if (search || theme) {
    const simpleFiles = files.map(({ file, contact }) => ({
      _id: file._id,
      name: file.name,
      qualificationLabel: file.metadata.qualification.label,
      translatedQualificationLabel: scannerT(
        `items.${file.metadata.qualification.label}`
      ),
      contact
    }))

    let filteredSimplesFiles = simpleFiles

    if (search) {
      fuse.setCollection(simpleFiles)
      filteredSimplesFiles = fuse.search(search).map(result => result.item)
    }

    if (theme) {
      filteredSimplesFiles = filteredSimplesFiles.filter(simpleFile =>
        hasItemByLabel(theme, simpleFile.qualificationLabel)
      )
    }

    filteredFiles = files
      .filter(({ file }) =>
        filteredSimplesFiles.some(simpleFile => simpleFile._id === file._id)
      )
      .sort((a, b) => b.file.updated_at.localeCompare(a.file.updated_at))
  }

  return filteredFiles
}
