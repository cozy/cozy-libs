import flatten from 'lodash/flatten'
import uniqBy from 'lodash/uniqBy'
import set from 'lodash/set'
import get from 'lodash/get'

const PARTS_TO_DELETE = [' (sans Secure Key)']

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

export const getAccountOwners = account =>
  get(account, 'owners.data', []).filter(Boolean)

const transformDocToRelationship = doc => ({
  _id: doc._id,
  _type: doc._type
})

/**
 * Set attributes into bank account, taking special care of
 * owner attributes.
 *
 * TODO: Rely on the schema to do that
 */
export const setFields = (account, fields) => {
  Object.keys(fields).forEach(key => {
    if (key === 'owners') {
      const ownerRelationships = fields[key]
        .filter(Boolean)
        .map(transformDocToRelationship)
      set(account, 'relationships.owners.data', ownerRelationships)
    } else {
      account[key] = fields[key]
    }
  })
}

export const getUniqueOwners = accounts => {
  const allOwners = flatten(accounts.map(getAccountOwners))
  const uniqOwners = uniqBy(allOwners, owner => owner._id)

  return uniqOwners
}
