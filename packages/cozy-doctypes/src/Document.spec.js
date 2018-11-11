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

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    Document.registerClient(null)
  })

  it('client cannot be registered twice', () => {
    expect(() => {
      const newClient = {}
      Document.registerClient(newClient)
    }).toThrow('Document cannot be re-registered to a client.')
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

    it('should delete duplicates', async () => {
      const data = [
        { a: 1, b: 1, c: 4 },
        { a: 1, b: 1, c: 5 },
        { a: 3, b: 4, c: 5 },
        { a: 3, b: 5, c: 5 },
        { a: 3, b: 5, c: 7 }
      ]
      jest.spyOn(Document, 'fetchAll').mockResolvedValue(data)
      jest.spyOn(Document, 'deleteAll').mockResolvedValue([])
      class AB extends Document {}
      AB.idAttributes = ['a', 'b']
      await AB.deleteDuplicates()
      expect(Document.deleteAll).toHaveBeenCalledWith([
        { a: 1, b: 1, c: 5 },
        { a: 3, b: 5, c: 7 }
      ])
    })
  })

  it('should not do anything if passed empty list', async () => {
    jest.spyOn(cozyClient.data, 'create').mockReset()
    jest.spyOn(cozyClient, 'fetchJSON').mockReset()
    const res = await Simpson.updateAll([])
    expect(cozyClient.data.create).not.toHaveBeenCalled()
    expect(cozyClient.fetchJSON).not.toHaveBeenCalled()
    expect(res).toEqual([])
  })

  it('should create database when bulk updating', async () => {
    jest
      .spyOn(cozyClient.data, 'create')
      .mockReset()
      .mockResolvedValue({ _id: 1 })
    jest
      .spyOn(cozyClient, 'fetchJSON')
      .mockReset()
      .mockRejectedValueOnce({
        reason: { reason: 'Database does not exist.' }
      })
      .mockImplementationOnce((method, doctype, data) =>
        Promise.resolve(
          data.docs.map(doc => ({ id: doc._id, _rev: Math.random(), ok: true }))
        )
      )

    jest.spyOn(Document, 'updateAll')

    const res = await Simpson.updateAll([
      { _id: 1, name: 'Marge' },
      { _id: 2, name: 'Homer' }
    ])

    expect(cozyClient.data.create).toHaveBeenCalledWith('io.cozy.simpsons', {
      _id: 1,
      name: 'Marge'
    })
    expect(Simpson.updateAll).toHaveBeenCalledWith([{ _id: 2, name: 'Homer' }])
    expect(res.map(doc => doc.id)).toEqual([1, 2])
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
