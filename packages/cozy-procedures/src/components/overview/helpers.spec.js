import MockDate from 'mockdate'

import CozyClient from 'cozy-client'

import {
  createFileWithContent,
  fetchCheckingsLikeAccounts,
  fetchTransactionsHistory
} from './helpers'

jest.mock('cozy-client')

let client
beforeEach(() => {
  client = new CozyClient()
})

afterEach(() => {
  jest.restoreAllMocks()
  MockDate.reset()
})

describe('createFileWithContent', () => {
  it('should create a file with the good content at the good place', async () => {
    const createFile = jest.fn(() => ({ data: {} }))
    jest.spyOn(client, 'collection').mockReturnValue({ createFile })

    await createFileWithContent(client, 'filename.json', 'dest', 'content')

    expect(createFile).toHaveBeenCalledWith(expect.any(File), { dirId: 'dest' })
  })
})

describe('fetchCheckingsLikeAccounts', () => {
  it('should return the accounts considered as checkings type', async () => {
    const where = jest.fn(() => ({ offset: jest.fn() }))
    jest.spyOn(client, 'find').mockReturnValue({
      where
    })
    const checkingsTypes = ['Checkings', 'Bank', 'Cash', 'Deposit']

    await fetchCheckingsLikeAccounts(client)

    expect(where).toHaveBeenCalledWith({
      type: {
        $in: checkingsTypes
      }
    })
  })
})

describe('fetchTransactionsHistory', () => {
  it('should fetch the transactions for the given accounts ids and the last 3 months', async () => {
    MockDate.set(new Date(2019, 6, 22))

    const where = jest.fn(() => ({ offset: jest.fn() }))
    jest.spyOn(client, 'find').mockReturnValue({
      where
    })
    const accountsIds = ['1', '2']

    await fetchTransactionsHistory(client, accountsIds)

    expect(where).toHaveBeenCalledWith({
      account: { $in: accountsIds },
      date: {
        $lt: '2019-07-01',
        $gt: '2019-04-01'
      }
    })
  })
})
