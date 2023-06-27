import flag from 'cozy-flags'

/**
 * @returns {number} the maximum papers allowed
 */
export const computeMaxPapers = () => {
  const maxPapers = flag('mespapiers.papers.max')
  if (maxPapers !== null) {
    return maxPapers === -1 ? Infinity : maxPapers
  }
  return Infinity
}
