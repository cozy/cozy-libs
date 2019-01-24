const groupBy = require('lodash/groupBy')
const sortBy = require('lodash/sortBy')
const { eitherIncludes } = require('./matching-tools')

const getDateTransaction = op => op.date.substr(0, 10)

/**
 * Groups `iterables` via `grouper` and returns an iterator
 * that yields [groupKey, groups]
 */
const zipGroup = function*(iterables, grouper) {
  const grouped = iterables.map(items => groupBy(items, grouper))
  for (const key of Object.keys(grouped[0]).sort()) {
    const groups = grouped.map(keyedGroups => keyedGroups[key] || [])
    yield [key, groups]
  }
}

const squash = (str, char) => {
  const rx = new RegExp(String.raw`${char}{2,}`, 'gi')
  return str && str.replace(rx, char)
}

const redactedNumber = /\b[0-9X]+\b/g
const dateRx = /\b\d{2}\/\d{2}\/\d{4}\b/g

const cleanLabel = label => label.replace(redactedNumber, '')
const withoutDate = str => str.replace(dateRx, '')

const scoreLabel = (newTr, existingTr) => {
  if (
    squash(existingTr.originalBankLabel, ' ') ===
    squash(newTr.originalBankLabel, ' ')
  ) {
    return [200, 'originalBankLabel']
  } else if (
    withoutDate(existingTr.originalBankLabel) ===
    withoutDate(newTr.originalBankLabel)
  ) {
    // For some transfers, the date in the originalBankLabel is different between
    // BudgetInsight and Linxo
    return [150, 'originalBankLabelWithoutDate']
  } else if (existingTr.label === newTr.label) {
    return [100, 'label']
  } else if (eitherIncludes(existingTr.label, newTr.label)) {
    return [70, 'eitherIncludes']
  } else if (
    eitherIncludes(cleanLabel(existingTr.label), cleanLabel(newTr.label))
  ) {
    return [50, 'fuzzy-eitherIncludes']
  } else {
    // Nothing matches, we penalize so that the score is below 0
    return [-1000, 'label-penalty']
  }
}

const MAX_DELTA_DATE = 1000 * 60 * 60 * 24 * 3 // 3 days

const withinAcceptableDateRange = (newTr, existingTr) => {
  const d1 = new Date(newTr.date.substr(0, 10))
  const d2 = new Date(existingTr.date.substr(0, 10))
  const delta = Math.abs(d1 - d2)
  if (delta <= MAX_DELTA_DATE) {
    return true
  }
  return false
}

const scoreMatching = (newTr, existingTr, options = {}) => {
  const methods = []
  const res = {
    op: existingTr,
    methods
  }

  if (options.checkDate) {
    if (!withinAcceptableDateRange(newTr, existingTr)) {
      // Early exit, transactions are two far off time-wise
      res.points = -1000
      return res
    } else {
      methods.push('approx-date')
    }
  }

  const [labelPoints, labelMethod] = scoreLabel(newTr, existingTr)
  methods.push(labelMethod)
  const amountDiff = Math.abs(existingTr.amount - newTr.amount)
  const amountPoints = amountDiff === 0 ? methods.push('amount') && 100 : -1000

  const points = amountPoints + labelPoints
  res.points = points
  return res
}

const matchTransaction = (newTr, existingTrs, options = {}) => {
  const exactVendorId = existingTrs.find(
    existingTr =>
      existingTr.vendorId &&
      newTr.vendorId &&
      existingTr.vendorId === newTr.vendorId
  )
  if (exactVendorId) {
    return { match: exactVendorId, method: 'vendorId' }
  }

  // Now we try to do it based on originalBankLabel, label and amount.
  // We score candidates according to their degree of matching
  // with the current transaction.
  // Candidates with score below 0 will be discarded.
  const withPoints = existingTrs.map(existingTr =>
    scoreMatching(newTr, existingTr, { checkDate: options.checkDate })
  )

  const candidates = sortBy(withPoints, x => -x.points).filter(
    x => x.points > 0
  )
  return candidates.length > 0
    ? {
        match: candidates[0].op,
        method: candidates[0].methods.join('-')
      }
    : {
        candidates
      }
}

/**
 * Logic to match a transaction and removing it from the transactions to
 * match. `matchingFn` is the function used for matching.
 */
const matchAndRemove = matchingFn =>
  function*(newTrs, existingTrs) {
    const toMatch = Array.isArray(existingTrs) ? [...existingTrs] : []
    for (let newTr of newTrs) {
      const res = {
        transaction: newTr
      }

      const result = toMatch.length > 0 ? matchingFn(newTr, toMatch) : null
      if (result) {
        Object.assign(res, result)
        const matchIdx = toMatch.indexOf(result.match)
        if (matchIdx > -1) {
          toMatch.splice(matchIdx, 1)
        }
      }
      yield res
    }
  }

const matchTransactionsWithinDay = matchAndRemove(matchTransaction)
const matchTransactionsApproximateDate = matchAndRemove((newTr, toMatch) => {
  return matchTransaction(newTr, toMatch, { checkDate: true })
})

const matchTransactions = function*(newTrs, existingTrs) {
  const unmatched = []
  const unmatchedExistingSet = new Set(existingTrs)
  // eslint-disable-next-line no-unused-vars
  for (let [date, [newGroup, existingGroup]] of zipGroup(
    [newTrs, existingTrs],
    getDateTransaction
  )) {
    for (let result of matchTransactionsWithinDay(newGroup, existingGroup)) {
      if (result.match) {
        unmatchedExistingSet.delete(result.match)
        yield result
      } else {
        unmatched.push(result.transaction)
      }
    }
  }

  const unmatchedExisting = Array.from(unmatchedExistingSet)
  for (let result of matchTransactionsApproximateDate(
    unmatched,
    unmatchedExisting
  )) {
    yield result
  }
}

module.exports = {
  matchTransactions,
  scoreMatching
}
