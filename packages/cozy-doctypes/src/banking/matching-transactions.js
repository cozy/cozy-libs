const groupBy = require('lodash/groupBy')
const sortBy = require('lodash/sortBy')

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

const eitherInclude = (str1, str2) => {
  return str1 && str2 && (str1.includes(str2) || str2.includes(str1))
}

const squash = (str, char) => {
  const rx = new RegExp(String.raw`${char}{2,}`, 'gi')
  return str.replace(rx, char)
}

const redactedNumber = /\b[0-9X]+\b/g
const dateRx = /\b\d{2}\/\d{2}\/\d{4}\b/g

const cleanLabel = label => label.replace(redactedNumber, '')
const withoutDate = str => str.replace(dateRx, '')
const scoreMatching = (newTr, existingTr) => {
  const methods = []
  let labelPoints
  if (
    squash(existingTr.originalBankLabel, ' ') ===
    squash(newTr.originalBankLabel, ' ')
  ) {
    labelPoints = 200
    methods.push('originalBankLabel')
  } else if (
    withoutDate(existingTr.originalBankLabel) ===
    withoutDate(newTr.originalBankLabel)
  ) {
    // For some transfers, the date in the originalBankLabel is different between
    // BudgetInsight and Linxo
    labelPoints = 150
    methods.push('originalBankLabelWithoutDate')
  } else if (existingTr.label === newTr.label) {
    labelPoints = 100
    methods.push('label')
  } else if (eitherInclude(existingTr.label, newTr.label)) {
    labelPoints = 70
    methods.push('eitherInclude')
  } else if (
    eitherInclude(cleanLabel(existingTr.label), cleanLabel(newTr.label))
  ) {
    labelPoints = 50
    methods.push('fuzzy-eitherInclude')
  } else {
    // Nothing matches, we penalize so that the score is below 0
    labelPoints = -1000
  }

  const amountDiff = Math.abs(existingTr.amount - newTr.amount)
  const amountPoints =
    amountDiff === 0 ? methods.push('amount') && 100 : -1000

  const points = amountPoints + labelPoints
  return {
    op: existingTr,
    points: points,
    amountDiff,
    methods
  }
}

const matchTransaction = (newTr, existingTrs) => {
  const exactVendorId = existingTrs.find(
    existingTr => existingTr.vendorId === newTr.vendorId
  )
  if (exactVendorId) {
    return { match: exactVendorId, method: 'vendorId' }
  }

  // Now we try to do it based on originalBankLabel, label and amount.
  // We score candidates according to their degree of matching
  // with the current transaction.
  // Candidates with score below 0 will be discarded.
  const withPoints = existingTrs.map(existingTr =>
    scoreMatching(newTr, existingTr)
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

const matchTransactionsWithinDay = function*(newTrs, existingTrs) {
  const toMatch = Array.isArray(existingTrs) ? [...existingTrs] : []
  for (let newTr of newTrs) {
    const res = {
      transaction: newTr
    }

    const result = toMatch.length > 0 ? matchTransaction(newTr, toMatch) : null
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

const matchTransactions = function*(newTrs, existingTrs) {
  // eslint-disable-next-line no-unused-vars
  for (let [date, [newGroup, existingGroup]] of zipGroup(
    [newTrs, existingTrs],
    getDateTransaction
  )) {
    for (let result of matchTransactionsWithinDay(newGroup, existingGroup)) {
      yield result
    }
  }
}

module.exports = {
  matchTransactions,
  scoreMatching
}
