const Document = require('./Document')
const { cozyClient } = require('./testUtils')

class Simpson extends Document {}
Simpson.doctype = 'io.cozy.simpsons'
Simpson.idAttributes = ['name']

describe('Document', () => {
  let queryResult = []
  beforeAll(() => {
    cozyClient.data.query.mockImplementation(() => Promise.resolve(queryResult))
    Document.registerClient(cozyClient)
  })

  afterAll(() => {
    Document.registerClient(null)
  })

  it('should do create or update', async () => {
    const marge = { name: 'Marge' }
    await Simpson.createOrUpdate(marge)
    expect(cozyClient.data.query).toHaveBeenCalledWith(expect.anything(), {
      selector: {
        name: 'Marge'
      }
    })
    expect(cozyClient.data.create).toHaveBeenCalledTimes(1)
    expect(cozyClient.data.updateAttributes).toHaveBeenCalledTimes(0)
    queryResult = [{ _id: 5, ...marge }]
    await Simpson.createOrUpdate(marge)
    expect(cozyClient.data.create).toHaveBeenCalledTimes(1)
    expect(cozyClient.data.updateAttributes).toHaveBeenCalledTimes(1)
  })

  it('should do bulk fetch', async () => {
    await Simpson.fetchAll()
    expect(cozyClient.fetchJSON).toHaveBeenCalledWith(
      'GET',
      '/data/io.cozy.simpsons/_all_docs?include_docs=true'
    )
  })

  describe('duplicates', () => {
    it('should find duplicates', () => {
      const data = [
        { a: 1, b: 1, c: 4 },
        { a: 1, b: 1, c: 5 },
        { a: 3, b: 4, c: 5 },
        { a: 3, b: 5, c: 5 },
        { a: 3, b: 5, c: 7 }
      ]
      class AB extends Document {}
      AB.idAttributes = ['a', 'b']
      const dups = AB.findDuplicates(data)
      expect(dups).toEqual([{ a: 1, b: 1, c: 5 }, { a: 3, b: 5, c: 7 }])
    })

    it('should find duplicates with complex id attributes', () => {
      const data = [
        { a: 1, b: { c: 1 }, d: 4 },
        { a: 1, b: { c: 1 }, d: 5 },
        { a: 3, b: { c: 4 }, d: 5 },
        { a: 3, b: { c: 5 }, d: 5 },
        { a: 3, b: { c: 5 }, d: 7 }
      ]
      class AB extends Document {}
      AB.idAttributes = ['a', 'b.c']
      const dups = AB.findDuplicates(data)
      expect(dups).toEqual([
        { a: 1, b: { c: 1 }, d: 5 },
        { a: 3, b: { c: 5 }, d: 7 }
      ])
    })
  })

  it('should do bulk delete', async () => {
    await Simpson.deleteAll([
      { _id: 1, name: 'Marge' },
      { _id: 2, name: 'Homer' }
    ])
    expect(cozyClient.fetchJSON).toHaveBeenCalledWith(
      'POST',
      '/data/io.cozy.simpsons/_bulk_docs',
      {
        docs: [
          { _deleted: true, _id: 1, name: 'Marge' },
          { _deleted: true, _id: 2, name: 'Homer' }
        ]
      }
    )
  })
})
