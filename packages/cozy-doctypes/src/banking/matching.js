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
  const toMatch = [...existingAccounts]
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
  matchAccounts
}
