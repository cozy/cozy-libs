import {
  createFileWithContent,
  fetchCheckingsLikeAccounts,
  fetchTransactionsHistory
} from './helpers'
import MockDate from 'mockdate'

afterEach(() => {
  MockDate.reset()
})

describe('createFileWithContent', () => {
  it('should create a file with the good content at the good place', async () => {
    const createFile = jest.fn(() => ({ data: {} }))
    const client = {
      collection: jest.fn(() => ({ createFile }))
    }

    await createFileWithContent(client, 'filename.json', 'dest', 'content')

    expect(createFile).toHaveBeenCalledWith(expect.any(File), { dirId: 'dest' })
  })
})

describe('fetchCheckingsLikeAccounts', () => {
  it('should return the accounts considered as checkings type', async () => {
    const where = jest.fn(() => ({ offset: jest.fn() }))
    const query = jest.fn().mockResolvedValue({
      next: false,
      data: [{ _id: '1' }, { _id: '2' }]
    })
    const client = {
      find: jest.fn(() => ({ where })),
      query
    }
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
    const query = jest.fn().mockResolvedValue({
      next: false,
      data: [{ _id: '1' }, { _id: '2' }]
    })
    const client = {
      find: jest.fn(() => ({ where })),
      query
    }
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
