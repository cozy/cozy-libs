const sortBy = require('lodash/sortBy')
const { eitherIncludes } = require('./matching-tools')
const { getSlugFromInstitutionLabel } = require('./slug-account')

const findExactMatch = (attr, account, existingAccounts) => {
  const sameAttr = existingAccounts.filter(
    existingAccount => existingAccount[attr] === account[attr]
  )
  if (sameAttr.length === 1) {
    return { match: sameAttr[0], method: attr + '-exact' }
  } else if (sameAttr.length > 1) {
    return { matches: sameAttr, method: attr + '-exact' }
  } else {
    return null
  }
}

const untrimmedAccountNumber = /^(?:[A-Za-z]+)?-?([0-9]+)-?(?:[A-Za-z]+)?$/
const redactedCreditCard = /xxxx xxxx xxxx (\d{4})/

const normalizeAccountNumber = (number, iban) => {
  iban = iban && iban.replace(/\s/g, '')
  number =
    number && !number.match(redactedCreditCard)
      ? number.replace(/\s/g, '')
      : number
  let match
  if (iban && iban.length == 27) {
    return iban.substr(14, 11)
  }

  if (!number) {
    return number
  }

  if (number.length == 23) {
    // Must be an IBAN without the COUNTRY code
    // See support demand #9102 with BI
    // We extract the account number from the IBAN
    // COUNTRY (4) BANK (5) COUNTER (5) NUMBER (11) KEY (2)
    // FRXX 16275 10501 00300060030 00
    return number.substr(10, 11)
  } else if (number.length == 16) {
    // Linxo sends Bank account number that contains
    // the counter number
    return number.substr(5, 11)
  } else if (
    number.length > 11 &&
    (match = number.match(untrimmedAccountNumber))
  ) {
    // Some account numbers from BI are in the form
    // CC-00300060030 (CC for Compte Courant) or
    // LEO-00300060030
    return match[1]
  } else {
    return number
  }
}

/**
 * If either of the account numbers has length 11 and one is contained
 * in the other, it's a match
 */
const approxNumberMatch = (account, existingAccount) => {
  return (
    existingAccount.number &&
    account.number &&
    (existingAccount.number.length === 11 || account.number.length === 11) &&
    eitherIncludes(existingAccount.number, account.number)
  )
}

const creditCardMatch = (account, existingAccount) => {
  let ccAccount, lastDigits
  for (let acc of [account, existingAccount]) {
    const match = acc.number && acc.number.match(redactedCreditCard)
    if (match) {
      ccAccount = acc
      lastDigits = match[1]
    }
  }
  const other = ccAccount === account ? existingAccount : account
  if (other.number.slice(-4) === lastDigits) {
    return true
  }
}

const slugMatch = (account, existingAccount) => {
  const possibleSlug = getSlugFromInstitutionLabel(account.institutionLabel)
  const possibleSlugExisting = getSlugFromInstitutionLabel(
    existingAccount.institutionLabel
  )
  return (
    !possibleSlug ||
    !possibleSlugExisting ||
    possibleSlug === possibleSlugExisting
  )
}

const score = (account, existingAccount) => {
  const methods = []
  const res = {
    account: existingAccount,
    methods
  }

  let points = 0

  /* To avoid accounts from different banks to be considered */
  if (!slugMatch(account, existingAccount)) {
    points -= 1000
  }

  if (approxNumberMatch(account, existingAccount)) {
    points += 50
    methods.push('approx-number')
  } else {
    points -= 50
  }
  if (account.type === existingAccount.type) {
    points += 50
    methods.push('same-type')
  }
  if (
    (account.type === 'CreditCard' || existingAccount.type === 'CreditCard') &&
    creditCardMatch(account, existingAccount)
  ) {
    points += 150
    methods.push('credit-card-number')
  }
  if (account.currency) {
    const sameCurrency =
      (existingAccount.rawNumber &&
        existingAccount.rawNumber.includes(account.currency)) ||
      (existingAccount.label &&
        existingAccount.label.includes(account.currency)) ||
      (existingAccount.originalBankLabel &&
        existingAccount.originalBankLabel.includes(account.currency))

    if (sameCurrency) {
      points += 50
      methods.push('currency')
    }
  }
  res.points = points
  return res
}

const normalizeAccount = account => {
  const normalizedAccountNumber = normalizeAccountNumber(
    account.number,
    account.iban
  )
  return {
    ...account,
    rawNumber: account.number,
    number: normalizedAccountNumber
  }
}

const exactMatchAttributes = ['iban', 'number']

const eqNotUndefined = (attr1, attr2) => {
  return attr1 && attr1 === attr2
}

const findMatch = (account, existingAccounts) => {
  // Start with exact attribute matches
  for (const exactAttribute of exactMatchAttributes) {
    if (account[exactAttribute]) {
      const result = findExactMatch(exactAttribute, account, existingAccounts)
      if (result && result.match) {
        return result
      }
    }
  }

  const matchOriginalNumber = existingAccounts.find(
    otherAccount =>
      eqNotUndefined(account.originalNumber, otherAccount.number) ||
      eqNotUndefined(account.number, otherAccount.originalNumber)
  )
  if (matchOriginalNumber) {
    return {
      match: matchOriginalNumber,
      method: 'originalNumber-exact'
    }
  }

  const matchRawNumberCurrencyType = existingAccounts.find(
    otherAccount =>
      (eqNotUndefined(account.rawNumber, otherAccount.number) ||
        eqNotUndefined(account.number, otherAccount.rawNumber)) &&
      otherAccount.type == account.type &&
      otherAccount.currency == account.currency
  )
  if (matchRawNumberCurrencyType) {
    return {
      match: matchRawNumberCurrencyType,
      method: 'rawNumber-exact-currency-type'
    }
  }

  // Now we get more fuzzy and score accounts
  const scored = sortBy(
    existingAccounts.map(existingAccount => score(account, existingAccount)),
    x => -x.points
  )
  const candidates = scored.filter(x => x.points > 0)
  if (candidates.length > 0) {
    return {
      match: candidates[0].account,
      method: candidates[0].methods.join('-')
    }
  }
}

const matchAccounts = (fetchedAccounts, existingAccounts) => {
  fetchedAccounts = fetchedAccounts.map(normalizeAccount)
  const toMatch = [...existingAccounts].map(normalizeAccount)
  const results = []
  for (let fetchedAccount of fetchedAccounts) {
    const matchResult = findMatch(fetchedAccount, toMatch)
    if (matchResult) {
      const i = toMatch.indexOf(matchResult.match)
      toMatch.splice(i, 1)
      results.push({ account: fetchedAccount, ...matchResult })
    } else {
      results.push({ account: fetchedAccount })
    }
  }
  return results
}

module.exports = {
  matchAccounts,
  normalizeAccountNumber,
  score
}
