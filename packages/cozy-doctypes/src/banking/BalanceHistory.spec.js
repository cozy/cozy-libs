const BalanceHistory = require('./BalanceHistory')
const Document = require('../Document')
const { cozyClientJS } = require('../testUtils')

describe('Balance history', () => {
  let queryResult = []

  beforeAll(() => {
    Document.registerClient(cozyClientJS)
    cozyClientJS.data.query.mockImplementation(() => {
      return Promise.resolve(queryResult)
    })
  })

  const doc = {
    year: 2018,
    relationships: {
      account: {
        data: {
          _id: 3
        }
      }
    }
  }

  it('should update or create on year + account linked', async () => {
    await BalanceHistory.createOrUpdate(doc)
    expect(cozyClientJS.data.query).toHaveBeenCalledWith(expect.anything(), {
      selector: {
        year: 2018,
        'relationships.account.data._id': 3
      }
    })
    expect(cozyClientJS.data.create).toHaveBeenCalledTimes(1)

    queryResult = [
      {
        year: 2018,
        relationships: {
          account: {
            data: {
              _id: 3
            }
          }
        }
      }
    ]

    await BalanceHistory.createOrUpdate(doc)
    expect(cozyClientJS.data.create).toHaveBeenCalledTimes(1)
  })
})
