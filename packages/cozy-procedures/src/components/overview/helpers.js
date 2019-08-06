import formatDate from 'date-fns/format'
import subMonths from 'date-fns/sub_months'
import startOfMonth from 'date-fns/start_of_month'
import pick from 'lodash/pick'
import groupBy from 'lodash/groupBy'
import get from 'lodash/get'
import { BankTransaction } from 'cozy-doctypes'

/**
 * createFileWithContent - upload a json file containing the given data
 *
 * @param {string} filename - The file name
 * @param {string} destinationId - The id of the destination directory
 * @param {string} content - The file content
 * @return {object} Information about the file (id and name)
 */
export const createFileWithContent = async (
  client,
  filename,
  destinationId,
  content
) => {
  const file = new File([content], filename)
  const resp = await client
    .collection('io.cozy.files')
    .createFile(file, { dirId: destinationId })

  return resp.data
}

export const fetchCheckingsLikeAccounts = client => {
  const query = client.find('io.cozy.bank.accounts').where({
    type: {
      $in: ['Checkings', 'Bank', 'Cash', 'Deposit']
    }
  })

  return client.queryAll(query)
}

export const fetchTransactionsHistory = async (client, accountsIds) => {
  const today = startOfMonth(new Date())
  const threeMonthsBefore = startOfMonth(subMonths(today, 3))

  const query = client.find('io.cozy.bank.operations').where({
    account: { $in: accountsIds },
    date: {
      $lt: formatDate(today, 'YYYY-MM-DD'),
      $gt: formatDate(threeMonthsBefore, 'YYYY-MM-DD')
    }
  })

  return client.queryAll(query)
}

export const fetchBanksSettings = async client => {
  const query = client.find('io.cozy.bank.settings')
  const response = await client.queryAll(query)
  const settings = response[0]

  return settings
}

export const fetchTransactionsHistoryContent = async client => {
  const accounts = await fetchCheckingsLikeAccounts(client)
  const accountsIds = accounts.map(account => account._id)
  const transactions = await fetchTransactionsHistory(client, accountsIds)
  const settings = await fetchBanksSettings(client)
  const localModelOverride = get(
    settings,
    'community.localModelOverride',
    false
  )

  const transactionsByAccount = groupBy(
    transactions,
    transaction => transaction.account
  )

  const rawContent = accounts.map(account => {
    const transactions = transactionsByAccount[account._id] || []

    return {
      ...pick(account, ['balance', 'iban']),
      transactions: transactions.map(transaction => {
        return {
          ...pick(transaction, ['amount', 'label', 'date']),
          category: BankTransaction.getCategoryId(transaction, {
            localModelOverride
          })
        }
      })
    }
  })

  return JSON.stringify(rawContent)
}
