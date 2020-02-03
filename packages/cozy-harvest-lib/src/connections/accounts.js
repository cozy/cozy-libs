import merge from 'lodash/merge'

export const ACCOUNTS_DOCTYPE = 'io.cozy.accounts'
const PERMISSIONS_DOCTYPE = 'io.cozy.permissions'

/**
 * Create an account for the given konnector.
 * @param  {Object}  client     CozyClient
 * @param  {Object}  konnector  io.cozy.konnectors document
 * @param  {Object}  attributes Account attributes
 */
const createAccount = async (client, konnector, attributes) => {
  const { data } = konnector.aggregator
    ? await createChildAccount(client, konnector, attributes)
    : await client.create(ACCOUNTS_DOCTYPE, attributes)
  return data
}

/**
 * TODO Use get
 * Performs a query to find the given account
 * @param  {Object}  client CozyClient
 * @param  {string}  id     io.cozy.accounts document's id
 * @return {Object}         Retrieved account
 */
export const findAccount = async (client, id) => {
  try {
    const { data } = await client.query(
      client.find(ACCOUNTS_DOCTYPE).where({
        _id: id
      })
    )
    return (data && data[0]) || null
  } catch (error) {
    if (error.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * Creates an account for an konnector needing an aggregator account.
 * Creates the aggregator account as well if it does not exist.
 * @param  {Object}  client     CozyClient
 * @param  {Object}  konnector  io.cozy.konnectors document
 * @param  {Object}  attributes Account attibutes
 * @return {Object}             The created io.cozy.accounts document
 */
const createChildAccount = async (client, konnector, attributes) => {
  const { aggregator } = konnector

  if (!aggregator || !aggregator.accountId)
    throw new Error('Konnector does not provide aggregator account id')

  const parentAccountId = aggregator.accountId

  let parentAccount
  try {
    parentAccount = await findAccount(client, parentAccountId)
  } catch (error) {
    throw new Error(
      `An error occurred when finding parent account ${parentAccountId} (${error.message})`
    )
  }

  if (!parentAccount) {
    try {
      parentAccount = await client.create(ACCOUNTS_DOCTYPE, {
        _id: parentAccountId
      })
    } catch (error) {
      throw new Error(
        `Cannot create parent account ${parentAccountId} (${error.message})`
      )
    }
  }

  try {
    await client.collection(PERMISSIONS_DOCTYPE).add(konnector, {
      aggregatorAccount: {
        type: ACCOUNTS_DOCTYPE,
        verbs: ['GET', 'PUT'],
        values: [`${ACCOUNTS_DOCTYPE}.${parentAccountId}`]
      }
    })
  } catch (error) {
    throw new Error(
      `Cannot set permission for account ${parentAccountId} (${error.message})`
    )
  }

  return await client.create(ACCOUNTS_DOCTYPE, {
    ...attributes,
    relationships: {
      parent: {
        data: {
          _id: parentAccountId,
          _type: ACCOUNTS_DOCTYPE
        }
      }
    }
  })
}

/**
 * Updates existing account
 * @param  {Object}  client  CozyClient
 * @param  {Object}  account io.cozy.accounts document to update
 * @return {Object}          Updated io.cozy.accounts document
 */
export const updateAccount = async (client, account) => {
  try {
    const { data } = await client.save(account)
    return data
  } catch (error) {
    if (error.status === 409) {
      /* We fetch before in case of conflicts since the account can be changed
      in the database by the konnector */
      const upToDateAccount = await findAccount(client, account._id)
      delete account._rev
      const { data } = await client.save(merge(upToDateAccount, account))
      return data
    } else {
      throw error
    }
  }
}

/**
 * Creates or updates account
 * @param  {Object}  client  CozyClient
 * @param  {Object}  konnector  io.cozy.konnectors document
 * @param  {Object}  authData   Account auth attribute
 */
const saveAccount = (client, konnector, account = {}) => {
  return account._id
    ? updateAccount(client, account)
    : createAccount(client, konnector, account)
}

/**
 * Deletes an account.
 * @param  {Object}  client  CozyClient
 * @param  {Object}  account io.cozy.accounts document
 */
export const deleteAccount = async (client, account) => {
  try {
    await client.destroy(account)
  } catch (error) {
    if (error.status === 409) {
      const syncedAccount = await findAccount(client, account._id)
      await client.destroy(syncedAccount)
    } else {
      throw error
    }
  }
}

/**
 * Get accounts mutations
 * @param  {Object} client CozyClient
 * @return {Object}        Object containing accounts mutations
 */
export const accountsMutations = client => ({
  createAccount: createAccount.bind(null, client),
  findAccount: findAccount.bind(null, client),
  updateAccount: updateAccount.bind(null, client),
  deleteAccount: deleteAccount.bind(null, client),
  saveAccount: saveAccount.bind(null, client)
})

export default accountsMutations
