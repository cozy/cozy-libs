import get from 'lodash/get'

export const getMatchingTrigger = (accountsAndTriggers, accountId) => {
  return get(
    accountsAndTriggers.find(
      accountAndTrigger => accountAndTrigger.account._id === accountId
    ),
    'trigger'
  )
}
