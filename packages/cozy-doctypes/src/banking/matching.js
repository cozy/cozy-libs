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

const normalizeAccountNumber = (number, iban) => {
  iban = iban && iban.replace(' ', '')
  let match
  if (iban && iban.length == 27) {
    return iban.substr(14, 11)
  }
  if (!number) {
    return
  }

  if (number && number.length == 23) {
    // Must be an IBAN without the COUNTRY code
    // See support demand #9102 with BI
    // We extract the account number from the IBAN
    // COUNTRY BANK COUNTER NUMBER KEY
    // FRXX 16275 10501 00300060030 00
    return number.substr(10, 11)
  } else if (number && number.length == 16) {
    // Linxo sends Bank account number that contains
    // the counter number
    return number.substr(5, 11)
  } else if (
    number &&
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

const normalizeAccount = account => {
  return {
    ...account,
    number: normalizeAccountNumber(account.number, account.iban)
  }
}

const findMatch = (account, existingAccounts) => {
  // IBAN
  if (account.iban) {
    const matchIBAN = findExactMatch('iban', account, existingAccounts)
    if (matchIBAN && matchIBAN.match) {
      return matchIBAN
    }
  }

  // Number
  if (account.number) {
    const numberMatch = findExactMatch('number', account, existingAccounts)
    // Number easy case
    if (numberMatch && numberMatch.match) {
      return numberMatch
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
  normalizeAccountNumber
}
