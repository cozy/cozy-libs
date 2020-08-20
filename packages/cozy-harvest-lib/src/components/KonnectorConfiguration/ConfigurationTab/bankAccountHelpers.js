import { get, uniqBy, flatten } from 'lodash'

const PARTS_TO_DELETE = ['(sans Secure Key)']

export const getAccountInstitutionLabel = account => {
  if (!account) {
    return account
  }
  const label = PARTS_TO_DELETE.reduce(
    (label, partToDelete) => label.replace(partToDelete, ''),
    account.institutionLabel || ''
  )

  return label
}

export const getAccountLabel = account =>
  account ? account.shortLabel || account.label : ''

export const accountTypesWithTranslation = [
  'Business',
  'Checkings',
  'CreditCard',
  'Joint',
  'Loan',
  'LongTermSavings',
  'Other',
  'Reimbursements',
  'Savings'
]

const accountTypesMap = {
  Article83: 'LongTermSavings',
  Asset: 'Business',
  Bank: 'Checkings',
  Capitalisation: 'Business',
  Cash: 'Checkings',
  ConsumerCredit: 'Loan',
  'Credit card': 'CreditCard',
  Deposit: 'Checkings',
  Liability: 'Business',
  LifeInsurance: 'LongTermSavings',
  Madelin: 'LongTermSavings',
  Market: 'LongTermSavings',
  Mortgage: 'LongTermSavings',
  None: 'Other',
  PEA: 'LongTermSavings',
  PEE: 'LongTermSavings',
  Perco: 'LongTermSavings',
  Perp: 'LongTermSavings',
  RevolvingCredit: 'Loan',
  RSP: 'LongTermSavings',
  Unkown: 'Other'
}

export const getAccountType = account => {
  const mappedType = accountTypesMap[account.type] || account.type || 'Other'
  const type = accountTypesWithTranslation.includes(mappedType)
    ? mappedType
    : 'Other'

  return type
}

export const getAccountOwners = account => {
  return get(account, 'owners.data', []).filter(Boolean)
}

export const getUniqueOwners = accounts => {
  const allOwners = flatten(accounts.map(getAccountOwners))
  const uniqOwners = uniqBy(allOwners, owner => owner._id)

  return uniqOwners
}
