import Fuse from 'fuse.js'

const fuse = new Fuse([], {
  findAllMatches: true,
  threshold: 0.3,
  ignoreLocation: true,
  ignoreFieldNorm: true,
  keys: ['name', 'translatedQualificationLabel', 'contact']
})

/**
 * Check if a theme has an item with a specific label
 * @param {import('cozy-client/types/types').Theme[]} themes - list of themes
 * @param {string} label - label to check
 * @returns {boolean} - true if the theme has an item with the label
 */
export const hasItemByLabel = (themes, label) => {
  if (themes.length === 0) return true
  return themes.some(({ items }) => items.some(item => item.label === label))
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

/**
 * Get the latest date from a list of files
 * @param {import('cozy-client/types/types').IOCozyFile[]} files - list of files
 * @returns {Date} - latest date
 */
const getLatestDate = files => {
  return Math.max(...files.map(file => new Date(file.created_at)))
}

/**
 * Compare function to sort categories by date
 * @param {string} a - first category
 * @param {string} b - second category
 * @param {Object} papersGrouped - object with qualification label as key and files as value
 *
//  */
const compareCategoryByDate = papersGrouped => (a, b) => {
  const dateA = new Date(getLatestDate(papersGrouped[a]))
  const dateB = new Date(getLatestDate(papersGrouped[b]))

  return dateB - dateA
}

/**
 * Group files by qualification label and sort them by date
 *
 * @param {import('cozy-client/types/types').IOCozyFile[]} files - list of files
 * @returns {Object} - object with qualification label as key and files as value
 */
export const makePapersGroupByQualificationLabel = files => {
  const filesGrouped = files.reduce((acc, file) => {
    const label = file.metadata.qualification.label
    if (!acc[label]) {
      acc[label] = []
    }
    acc[label].push(file)

    return acc
  }, {})

  const sortedCategories = Object.keys(filesGrouped).sort(
    compareCategoryByDate(filesGrouped)
  )

  const result = {}
  for (let category of sortedCategories) {
    result[category] = filesGrouped[category]
  }

  return result
}
