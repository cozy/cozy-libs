/**
 * Sort paperDefinitions list alphabetical order then:
 * - Papers with acquisitionSteps or with konnectorCriteria (papersUsedList)
 * - Papers without acquisitionSteps and without konnectorCriteria (papersUnUsedList)
 * - Papers of type "other_identity_document" etc (otherPaperList)
 *
 * @param {Object[]} papersDefList - Array of Papers
 * @param {Function} scannerT - I18n function
 * @returns {Object[]} - Array of Papers sorted
 */
export const buildPapersDefinitions = (papersDefList, scannerT) => {
  const papersDefListSorted = [...papersDefList].sort((w, x) => {
    return scannerT(`items.${w.label}`) > scannerT(`items.${x.label}`)
      ? 1
      : scannerT(`items.${x.label}`) > scannerT(`items.${w.label}`)
      ? -1
      : 0
  })

  const [papersUsedList, papersUnUsedList, otherPaperList, noteList] =
    papersDefListSorted.reduce(
      ([used, unUsed, other, note], currentPaperDef) => {
        if (/other_/i.test(currentPaperDef.label)) {
          return [used, unUsed, [...other, currentPaperDef], note]
        }
        if (/note_/i.test(currentPaperDef.label)) {
          return [used, unUsed, other, [...note, currentPaperDef]]
        }

        return currentPaperDef.acquisitionSteps.length > 0 ||
          currentPaperDef.konnectorCriteria
          ? [[...used, currentPaperDef], unUsed, other, note]
          : [used, [...unUsed, currentPaperDef], other, note]
      },
      [[], [], [], []]
    )

  return [
    ...papersUsedList,
    ...otherPaperList,
    ...noteList,
    ...papersUnUsedList
  ]
}
