const get = require('lodash/get')
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
// Regexp targeting hidden credit card number like
// ****-****-****-1234;xxxx xxxx xxxx 1234;************1234
const redactedCreditCard = /[x*]{4}[ -]?[x*]{4}[ -]?[x*]{4}[ -]?(\d{4})/

const normalizeAccountNumber = (numberArg, ibanArg) => {
  const iban = ibanArg && ibanArg.replace(/\s/g, '')
  const number =
    numberArg && !numberArg.match(redactedCreditCard)
      ? numberArg.replace(/\s/g, '')
      : numberArg
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
    eitherIncludes(existingAccount.number, account.number) &&
    Math.min(existingAccount.number.length, account.number.length) >= 4
  )
}

/**
 * If there is no "number" attribute or null, "id" attribute is used
 * in the other, it's not a match
 *
 * @param account
 * @param existingAccount
 * @returns {boolean}
 */
const noNumberMatch = (account, existingAccount) => {
  const accNumber = account.number || String(account.id)
  const existingAccNumber = existingAccount.number || String(existingAccount.id)
  if (!account.number || !existingAccount.number) {
    return eitherIncludes(accNumber, existingAccNumber)
  }
  return false
}

const creditCardMatch = (account, existingAccount) => {
  if (account.type !== 'CreditCard' && existingAccount.type !== 'CreditCard') {
    return false
  }
  let ccAccount, lastDigits
  for (let acc of [account, existingAccount]) {
    const match = acc && acc.number && acc.number.match(redactedCreditCard)
    if (match) {
      ccAccount = acc
      lastDigits = match[1]
    }
  }
  const other = ccAccount === account ? existingAccount : account
  if (other && other.number && other.number.slice(-4) === lastDigits) {
    return true
  }
  return false
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

const currencyMatch = (account, existingAccount) => {
  if (!account.currency) {
    return false
  }
  return (
    (existingAccount.rawNumber &&
      existingAccount.rawNumber.includes(account.currency)) ||
    (existingAccount.label &&
      existingAccount.label.includes(account.currency)) ||
    (existingAccount.originalBankLabel &&
      existingAccount.originalBankLabel.includes(account.currency))
  )
}

const sameTypeMatch = (account, existingAccount) => {
  return account.type === existingAccount.type
}

const rules = [
  { rule: slugMatch, bonus: 0, malus: -1000 },
  { rule: approxNumberMatch, bonus: 50, malus: -50, name: 'approx-number' },
  { rule: noNumberMatch, bonus: 10, malus: -10, name: 'no-number-attr' },
  { rule: sameTypeMatch, bonus: 50, malus: 0, name: 'same-type' },
  { rule: creditCardMatch, bonus: 150, malus: 0, name: 'credit-card-number' },
  { rule: currencyMatch, bonus: 50, malus: 0, name: 'currency' }
]

const score = (account, existingAccount) => {
  const methods = []
  const res = {
    account: existingAccount,
    methods
  }

  let points = 0
  for (let { rule, bonus, malus, name } of rules) {
    const ok = rule(account, existingAccount)
    if (ok && bonus) {
      points += bonus
    }
    if (!ok && malus) {
      points += malus
    }
    if (name && ok) {
      methods.push(name)
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
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
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

/**
 * Matches existing accounts with accounts fetched on a vendor
 *
 * @typedef {MatchResult}
 * @property {io.cozy.account} account - Account from fetched accounts
 * @property {io.cozy.account} match - Existing account that was matched. Null if no match was found.
 * @property {string} method - How the two accounts were matched
 *
 * @param  {io.cozy.account} fetchedAccounts - Account that have been fetched
 * on the vendor and that will be matched with existing accounts
 * @param  {io.cozy.accounts} existingAccounts - Will be match against (those
 * io.cozy.accounts already have an _id)
 * @return {Array<MatchResult>} - Match results (as many results as fetchedAccounts.length)
 */
const matchAccounts = (fetchedAccountsArg, existingAccounts) => {
  const fetchedAccounts = fetchedAccountsArg.map(normalizeAccount)
  const toMatch = [...existingAccounts].map(normalizeAccount)
  const results = []
  for (let fetchedAccount of fetchedAccounts) {
    const matchResult = findMatch(fetchedAccount, toMatch)
    if (matchResult) {
      const i = toMatch.indexOf(matchResult.match)
      toMatch.splice(i, 1)
      if (
        !get(fetchedAccount, 'metadata.disabledAt') ||
        !get(matchResult, 'metadata.disabledAt')
      ) {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        results.push({ account: fetchedAccount, ...matchResult })
      }
    } else {
      if (!get(fetchedAccount, 'metadata.disabledAt')) {
        results.push({ account: fetchedAccount })
      }
    }
  }
  return results
}

module.exports = {
  matchAccounts,
  normalizeAccountNumber,
  score,
  creditCardMatch,
  approxNumberMatch
}
