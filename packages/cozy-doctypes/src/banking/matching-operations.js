const groupBy = require('lodash/groupBy')
const sortBy = require('lodash/sortBy')

const getDateOperation = op => op.date.substr(0, 10)

/**
 * Groups `iterables` via `grouper` and returns an iterator
 * that yields [groupKey, groups]
 */
const zipGroup = function*(iterables, grouper) {
  const grouped = iterables.map(items => groupBy(items, grouper))
  for (const key of Object.keys(grouped[0]).sort()) {
    const groups = grouped.map(keyedGroups => keyedGroups[key])
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
const cleanLabel = label => label.replace(redactedNumber, '')
const scoreMatching = (newOp, existingOp) => {
  const methods = []
  let labelPoints
  if (squash(existingOp.originalBankLabel, ' ') === squash(newOp.originalBankLabel, ' ')) {
    labelPoints = 200
    methods.push('originalBankLabel')
  } else if (existingOp.label === newOp.label) {
    labelPoints = 100
    methods.push('label')
  } else if (eitherInclude(existingOp.label, newOp.label)) {
    labelPoints = 70
    methods.push('eitherInclude')
  } else if (
    eitherInclude(cleanLabel(existingOp.label), cleanLabel(newOp.label))
  ) {
    labelPoints = 50
    methods.push('fuzzy-eitherInclude')
  } else {
    // Nothing matches, we penalize so that the score is below 0
    labelPoints = -1000
  }

  const amountDiff = Math.abs(existingOp.amount - newOp.amount)
  const amountPoints =
    amountDiff === 0 ? methods.push('amount') && 100 : -1000

  const points = amountPoints + labelPoints
  return {
    op: existingOp,
    points: points,
    amountDiff,
    methods
  }
}

const matchOperation = (newOp, existingOps) => {
  const exactVendorId = existingOps.find(
    existingOp => existingOp.vendorId === newOp.vendorId
  )
  if (exactVendorId) {
    return { match: exactVendorId, method: 'vendorId' }
  }

  // Now we try to do it based on originalBankLabel, label and amount.
  // We score candidates according to their degree of matching
  // with the current operation.
  // Candidates with score below 0 will be discarded.
  const withPoints = existingOps.map(existingOp => scoreMatching(newOp, existingOp))

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

const matchOperationsWithinDay = function*(newOps, existingOps) {
  const toMatch = Array.isArray(existingOps) ? [...existingOps] : []
  for (let newOp of newOps) {
    const res = {
      operation: newOp
    }

    const result = toMatch.length > 0
      ? matchOperation(newOp, toMatch)
      : null
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

const matchOperations = function*(newOps, existingOps) {
  for (let [, [newGroup, existingGroup]] of zipGroup(
    [newOps, existingOps],
    getDateOperation
  )) {
    for (let result of matchOperationsWithinDay(newGroup, existingGroup)) {
      yield result
    }
  }
}

module.exports = {
  matchOperations
}
