import deleteAccounts from 'services/deleteAccounts'
import { fetchAccountsForCipherId } from 'services/utils'
import { deleteAccount } from 'connections/accounts'

jest.mock('services/utils')
jest.mock('connections/accounts')

describe('deleteAccounts', () => {
  it('should delete all accounts linked to the deleted cipher', async () => {
    const deletedCipher = { _id: 'bdf9ef21ef243af8abd57e4243010e8f' }
    const accounts = [
      { _id: 'account1', _type: 'io.cozy.accounts' },
      { _id: 'account2', _type: 'io.cozy.accounts' }
    ]
    fetchAccountsForCipherId.mockResolvedValue({
      data: accounts
    })

    const clientMock = {
      destroy: jest.fn()
    }

    await deleteAccounts(clientMock, deletedCipher)

    expect(deleteAccount).toHaveBeenCalledTimes(2)
    expect(deleteAccount).toHaveBeenCalledWith(clientMock, accounts[0])
    expect(deleteAccount).toHaveBeenCalledWith(clientMock, accounts[1])
  })
})
