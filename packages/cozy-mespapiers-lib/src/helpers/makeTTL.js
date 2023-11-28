import log from 'cozy-logger'

/**
 * Make a TTL string from a date
 * @param {Date|string} selectedDate
 * @returns {string} - TTL string in seconds (e.g. '1234s')
 */
export const makeTTL = selectedDate => {
  if (!selectedDate) return
  try {
    let selectedDateConverted = selectedDate
    if (typeof selectedDate === 'string') {
      selectedDateConverted = new Date(selectedDate)
      if (selectedDateConverted?.toString() === 'Invalid Date') {
        throw new Error(`Invalid date: ${selectedDate}`)
      }
    }
    if (selectedDateConverted instanceof Date) {
      const now = new Date()
      const ttl =
        selectedDateConverted > now
          ? `${Math.round((selectedDateConverted - now) / 1000)}s`
          : undefined
      return ttl
    }
    throw new Error(`Invalid date: ${selectedDate}`)
  } catch (error) {
    log('error', `Error in 'makeTTL' function: ${error}`)
    return
  }
}
