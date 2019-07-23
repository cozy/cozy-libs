import formatDate from 'date-fns/format'
import subMonths from 'date-fns/sub_months'
import startOfMonth from 'date-fns/start_of_month'
import pick from 'lodash/pick'
import groupBy from 'lodash/groupBy'

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

export const fetchTransactionsHistoryContent = async client => {
  const accounts = await fetchCheckingsLikeAccounts(client)
  const accountsIds = accounts.map(account => account._id)
  const transactions = await fetchTransactionsHistory(client, accountsIds)

  const transactionsByAccount = groupBy(
    transactions,
    transaction => transaction.account
  )

  const rawContent = accounts.map(account => {
    return {
      ...pick(account, ['balance', 'iban']),
      transactions: transactionsByAccount[account._id].map(transaction =>
        pick(transaction, ['amount', 'label', 'date'])
      )
    }
  })

  return JSON.stringify(rawContent)
}
