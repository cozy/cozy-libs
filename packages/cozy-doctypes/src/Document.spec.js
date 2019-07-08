const Document = require('./Document')
const { cozyClientJS, cozyClient } = require('./testUtils')

class Simpson extends Document {}
Simpson.doctype = 'io.cozy.simpsons'
Simpson.idAttributes = ['name']

describe('Document', () => {
  let queryResult = []
  beforeAll(() => {
    cozyClientJS.data.query.mockImplementation(() =>
      Promise.resolve(queryResult)
    )
  })

  beforeEach(() => {
    Document.registerClient(cozyClientJS)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    Document.cozyClient = null
  })

  describe('registerClient', () => {
    it('client cannot be registered twice', () => {
      expect(() => {
        const newClient = {}
        Document.registerClient(newClient)
      }).toThrow('Document cannot be re-registered to a client.')
    })
  })

  describe('usesCozyClient', () => {
    it('should return false', () => {
      expect(Document.usesCozyClient()).toBe(false)
    })
  })

  it('should do create or update', async () => {
    const marge = { name: 'Marge' }
    await Simpson.createOrUpdate(marge)
    expect(cozyClientJS.data.query).toHaveBeenCalledWith(expect.anything(), {
      selector: {
        name: 'Marge'
      }
    })
    expect(cozyClientJS.data.create).toHaveBeenCalledTimes(1)
    expect(cozyClientJS.data.updateAttributes).toHaveBeenCalledTimes(0)
    queryResult = [{ _id: 5, ...marge }]
    await Simpson.createOrUpdate(marge)
    expect(cozyClientJS.data.create).toHaveBeenCalledTimes(1)
    expect(cozyClientJS.data.updateAttributes).toHaveBeenCalledTimes(1)
  })

  it('should update updatedAt cozyMetadata on create or update', async () => {
    const marge = { name: 'Marge' }
    const margeWithCozyMetas = Simpson.addCozyMetadata(marge)

    expect(margeWithCozyMetas.cozyMetadata).toBeDefined()
    expect(margeWithCozyMetas.cozyMetadata.updatedAt).toEqual(expect.any(Date))
  })

  it('should add createdByApp cozyMetadata on create or update if needed and possible', async () => {
    const marge = { name: 'Marge' }
    const margeWithCozyMetas = Simpson.addCozyMetadata(marge)

    expect(margeWithCozyMetas.cozyMetadata).toBeDefined()
    expect(margeWithCozyMetas.cozyMetadata.createdByApp).not.toBeDefined()

    class MetadataSimpson extends Simpson {}
    MetadataSimpson.createdByApp = 'simpsoncreator'
    const bart = { name: 'Bart' }
    const bartWithCozyMetas = MetadataSimpson.addCozyMetadata(bart)
    expect(bartWithCozyMetas.cozyMetadata).toBeDefined()
    expect(bartWithCozyMetas.cozyMetadata.createdByApp).toEqual(
      'simpsoncreator'
    )
  })

  describe('updated by apps', () => {
    const marge = { name: 'Marge' }
    const bart = { name: 'Bart' }

    class MetadataSimpson extends Simpson {}
    MetadataSimpson.createdByApp = 'simpsoncreator'

    it('should not add updatedByApps if createdByApp not defined', () => {
      const margeWithCozyMetas = Simpson.addCozyMetadata(marge)
      expect(margeWithCozyMetas.cozyMetadata).toBeDefined()
      expect(margeWithCozyMetas.cozyMetadata.createdByApp).not.toBeDefined()
      expect(margeWithCozyMetas.cozyMetadata.updatedByApps).not.toBeDefined()
    })

    it('should add updatedByApps cozyMetadata on create or update', async () => {
      const bartWithCozyMetas = MetadataSimpson.addCozyMetadata(bart)
      expect(bartWithCozyMetas.cozyMetadata).toBeDefined()
      expect(bartWithCozyMetas.cozyMetadata.updatedByApps).toBeDefined()

      const updateInfo = bartWithCozyMetas.cozyMetadata.updatedByApps.find(
        x => x.slug === 'simpsoncreator'
      )
      expect(updateInfo).toMatchObject({
        date: expect.any(Date)
      })
    })

    it('should not add updatedByApps twice', () => {
      const bartWithCozyMetas2 = MetadataSimpson.addCozyMetadata(
        MetadataSimpson.addCozyMetadata(bart)
      )
      expect(
        bartWithCozyMetas2.cozyMetadata.updatedByApps.filter(
          x => x.slug === 'simpsoncreator'
        ).length
      ).toBe(1)
    })
  })

  it('should do bulk fetch', async () => {
    await Simpson.fetchAll()
    expect(cozyClientJS.fetchJSON).toHaveBeenCalledWith(
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
    jest.spyOn(cozyClientJS.data, 'create').mockReset()
    jest.spyOn(cozyClientJS, 'fetchJSON').mockReset()
    const res = await Simpson.updateAll([])
    expect(cozyClientJS.data.create).not.toHaveBeenCalled()
    expect(cozyClientJS.fetchJSON).not.toHaveBeenCalled()
    expect(res).toEqual([])
  })

  it('should create database when bulk updating', async () => {
    jest
      .spyOn(cozyClientJS.data, 'create')
      .mockReset()
      .mockResolvedValue({ _id: 1 })
    jest
      .spyOn(cozyClientJS, 'fetchJSON')
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

    expect(cozyClientJS.data.create).toHaveBeenCalledWith('io.cozy.simpsons', {
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
    expect(cozyClientJS.fetchJSON).toHaveBeenCalledWith(
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

  describe('fetch changes', () => {
    beforeEach(() => {
      cozyClientJS.fetchJSON.mockReset()
    })
    afterEach(() => {
      cozyClientJS.fetchJSON.mockReset()
    })
    it('should work in simple case', async () => {
      cozyClientJS.fetchJSON.mockReturnValueOnce(
        Promise.resolve({
          last_seq: 'new-seq',
          results: [
            { doc: { _id: '1', name: 'Lisa' } },
            { doc: null },
            { doc: { _id: '_design/view' } },
            { doc: { _id: '2', _deleted: true, name: 'Bart' } }
          ]
        })
      )

      const changes = await Simpson.fetchChanges('my-seq')
      expect(cozyClientJS.fetchJSON).toHaveBeenCalledWith(
        'GET',
        '/data/io.cozy.simpsons/_changes?since=my-seq&include_docs=true'
      )
      expect(changes).toEqual({
        newLastSeq: 'new-seq',
        documents: [{ _id: '1', name: 'Lisa' }]
      })
    })

    it('should support query options', async () => {
      cozyClientJS.fetchJSON.mockReturnValueOnce(
        Promise.resolve({
          last_seq: 'new-seq',
          results: []
        })
      )

      await Simpson.fetchChanges('my-seq', {
        params: { descending: true, limit: 1 }
      })
      expect(cozyClientJS.fetchJSON).toHaveBeenCalledWith(
        'GET',
        '/data/io.cozy.simpsons/_changes?since=my-seq&include_docs=true&descending=true&limit=1'
      )
    })
  })

  describe('query all', () => {
    afterEach(() => {
      cozyClientJS.data.query.mockReset()
    })
    it('should repeatedly call query until all documents have been fetched', async () => {
      let i = 0
      cozyClientJS.data.query.mockImplementation(() => {
        let docs
        if (i == 0) {
          docs = [{ _id: 1, name: 'Lisa' }]
        } else if (i == 1) {
          docs = [{ _id: 2, name: 'Bart' }]
        } else if (i == 2) {
          docs = [{ _id: 3, name: 'Homer' }]
        } else if (i == 3) {
          docs = [{ _id: 4, name: 'Marge' }]
        }
        const resp = {
          docs,
          next: i !== 3
        }
        i++
        return Promise.resolve(resp)
      })
      const docs = await Simpson.queryAll({ name: { $exists: true } })
      expect(cozyClientJS.data.defineIndex).toHaveBeenCalledWith(
        'io.cozy.simpsons',
        ['name']
      )
      expect(docs.length).toBe(4)
      expect(
        cozyClientJS.data.query.mock.calls.slice(-4).map(x => x[1].skip)
      ).toEqual([0, 1, 2, 3])
    })
  })

  describe('get all', () => {
    beforeEach(() => {
      cozyClientJS.fetchJSON.mockReset()
    })

    afterEach(() => {
      cozyClientJS.fetchJSON.mockReset()
    })

    it('should work', async () => {
      cozyClientJS.fetchJSON.mockResolvedValueOnce({
        rows: [
          { doc: { _id: '123abde', name: 'Lisa' } },
          { doc: { _id: '2123asb', name: 'Bart' } }
        ]
      })
      const docs = await Simpson.getAll(['123abde', '2123asb'])
      expect(cozyClientJS.fetchJSON).toHaveBeenCalledWith(
        'POST',
        '/data/io.cozy.simpsons/_all_docs?include_docs=true',
        {
          keys: ['123abde', '2123asb']
        }
      )
      expect(docs).toEqual([
        { _id: '123abde', name: 'Lisa' },
        { _id: '2123asb', name: 'Bart' }
      ])
    })

    it('should return empty list in case of error', async () => {
      cozyClientJS.fetchJSON.mockRejectedValueOnce({
        message: 'not_found'
      })
      const docs = await Simpson.getAll(['notexisting'])
      expect(docs).toEqual([])
    })
  })

  it('should be possible for a subclass to access to the registered cozyClient', () => {
    class SubSimpson extends Simpson {
      static fetch() {
        this.cozyClient.fetchJSON('GET', '/data/io.cozy.simpsons/_all_docs')
      }
    }

    SubSimpson.fetch()

    expect(cozyClientJS.fetchJSON).toHaveBeenLastCalledWith(
      'GET',
      '/data/io.cozy.simpsons/_all_docs'
    )
  })

  describe('get', () => {
    it('should throw an error if used with cozy-client-js', async () => {
      expect.assertions(1)
      await expect(Simpson.get('lisa')).rejects.toEqual(
        new Error('This method is not implemented with cozy-client-js')
      )
    })
  })
})

describe('Document used with CozyClient', () => {
  beforeEach(() => {
    Document.registerClient(cozyClient)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    Document.cozyClient = null
  })

  describe('usesCozyClient', () => {
    it('should return true', () => {
      expect(Document.usesCozyClient()).toBe(true)
    })
  })

  describe('getIndex', () => {
    it('should throw an error if used with a CozyClient', () => {
      expect(() => Document.getIndex('io.cozy.simpsons', ['name'])).toThrow(
        'This method is not implemented yet with CozyClient'
      )
    })
  })

  describe('createOrUpdate', () => {
    afterEach(() => {
      Simpson.queryAll.mockReset()
    })

    it('should throw an error if there are more than one corresponding documents', async () => {
      jest
        .spyOn(Simpson, 'queryAll')
        .mockReturnValueOnce([{ name: 'Marge' }, { name: 'Marge' }])

      await expect(Simpson.createOrUpdate({ name: 'Marge' })).rejects.toThrow()
    })

    it('should create the document if it does not exist', async () => {
      jest.spyOn(Simpson, 'queryAll').mockReturnValueOnce([])
      jest.spyOn(Simpson, 'create').mockReturnValueOnce()

      await Simpson.createOrUpdate({ name: 'Marge' })

      expect(Simpson.create).toHaveBeenCalledWith(
        Simpson.addCozyMetadata({ name: 'Marge' })
      )
    })

    it('should update the document if it already exists', async () => {
      jest.spyOn(Simpson, 'queryAll').mockReturnValueOnce([{ name: 'Marge' }])
      jest.spyOn(cozyClient, 'save').mockReturnValueOnce()

      await Simpson.createOrUpdate({ name: 'Marge', son: 'Bart' })

      expect(cozyClient.save).toHaveBeenCalledWith(
        Simpson.addCozyMetadata({ name: 'Marge', son: 'Bart' })
      )
    })
  })

  describe('create', () => {
    afterEach(() => {
      cozyClient.create.mockReset()
    })

    it('should create the document with the given attributes', async () => {
      jest.spyOn(cozyClient, 'create').mockImplementation(() => {})

      const marge = { name: 'Marge' }
      await Simpson.create(marge)

      expect(cozyClient.create).toHaveBeenCalledWith('io.cozy.simpsons', marge)
    })
  })

  describe('query', () => {
    it('should throw an error if used with a CozyClient', () => {
      expect(() => Document.query({})).toThrow(
        new Error('This method is not implemented yet with CozyClient')
      )
    })
  })

  describe('queryAll', () => {
    afterEach(() => {
      cozyClient.stackClient.collection.mockReset()
    })

    it('should return all the documents while there are next documents', async () => {
      let i = 0
      cozyClient.stackClient.collection.mockReturnValue({
        find: jest.fn().mockImplementation(() => {
          let data
          if (i == 0) {
            data = [{ _id: 1, _type: 'io.cozy.simpsons', name: 'Lisa' }]
          } else if (i == 1) {
            data = [{ _id: 2, _type: 'io.cozy.simpsons', name: 'Bart' }]
          } else if (i == 2) {
            data = [{ _id: 3, _type: 'io.cozy.simpsons', name: 'Homer' }]
          } else if (i == 3) {
            data = [{ _id: 4, _type: 'io.cozy.simpsons', name: 'Marge' }]
          }
          const resp = {
            data,
            next: i !== 3
          }
          i++
          return Promise.resolve(resp)
        })
      })

      const docs = await Simpson.queryAll({ name: { $exists: true } })
      expect(docs).toMatchSnapshot()
    })

    it('should call fetchAll if no selector is given', () => {
      jest.spyOn(Simpson, 'fetchAll').mockImplementation(() => {})
      Simpson.queryAll()
      expect(Simpson.fetchAll).toHaveBeenCalled()
    })
  })

  describe('getAll', () => {
    beforeEach(() => {
      cozyClient.stackClient.fetchJSON.mockReset()
    })

    afterEach(() => {
      cozyClient.stackClient.fetchJSON.mockReset()
    })

    it('should work', async () => {
      cozyClient.stackClient.fetchJSON.mockResolvedValueOnce({
        rows: [
          { doc: { _id: '123abde', name: 'Lisa' } },
          { doc: { _id: '2123asb', name: 'Bart' } }
        ]
      })
      const docs = await Simpson.getAll(['123abde', '2123asb'])
      expect(cozyClient.stackClient.fetchJSON).toHaveBeenCalledWith(
        'POST',
        '/data/io.cozy.simpsons/_all_docs?include_docs=true',
        {
          keys: ['123abde', '2123asb']
        }
      )
      expect(docs).toEqual([
        { _id: '123abde', name: 'Lisa' },
        { _id: '2123asb', name: 'Bart' }
      ])
    })

    it('should return empty list in case of error', async () => {
      cozyClient.stackClient.fetchJSON.mockRejectedValueOnce({
        message: 'not_found'
      })
      const docs = await Simpson.getAll(['notexisting'])
      expect(docs).toEqual([])
    })
  })

  describe('fetchChanges', () => {
    beforeEach(() => {
      cozyClient.stackClient.fetchJSON.mockReset()
    })

    afterEach(() => {
      cozyClient.stackClient.fetchJSON.mockReset()
    })

    it('should work in simple case', async () => {
      cozyClient.stackClient.fetchJSON.mockReturnValueOnce(
        Promise.resolve({
          last_seq: 'new-seq',
          results: [
            { doc: { _id: '1', name: 'Lisa' } },
            { doc: null },
            { doc: { _id: '_design/view' } },
            { doc: { _id: '2', _deleted: true, name: 'Bart' } }
          ]
        })
      )

      const changes = await Simpson.fetchChanges('my-seq')
      expect(cozyClient.stackClient.fetchJSON).toHaveBeenCalledWith(
        'GET',
        '/data/io.cozy.simpsons/_changes?since=my-seq&include_docs=true'
      )
      expect(changes).toEqual({
        newLastSeq: 'new-seq',
        documents: [{ _id: '1', name: 'Lisa' }]
      })
    })

    it('should support query options', async () => {
      cozyClient.stackClient.fetchJSON.mockReturnValueOnce(
        Promise.resolve({
          last_seq: 'new-seq',
          results: []
        })
      )

      await Simpson.fetchChanges('my-seq', {
        params: { descending: true, limit: 1 }
      })
      expect(cozyClient.stackClient.fetchJSON).toHaveBeenCalledWith(
        'GET',
        '/data/io.cozy.simpsons/_changes?since=my-seq&include_docs=true&descending=true&limit=1'
      )
    })
  })

  describe('fetchAll', () => {
    it('should do bulk fetch', async () => {
      await Simpson.fetchAll()
      expect(cozyClient.stackClient.fetchJSON).toHaveBeenCalledWith(
        'GET',
        '/data/io.cozy.simpsons/_all_docs?include_docs=true'
      )
    })
  })

  describe('updateAll', () => {
    beforeEach(() => {
      cozyClient.stackClient.fetchJSON.mockReset()
    })

    afterEach(() => {
      cozyClient.stackClient.fetchJSON.mockReset()
    })

    it('should not do anything if passed empty list', async () => {
      const res = await Simpson.updateAll([])
      expect(cozyClient.stackClient.fetchJSON).not.toHaveBeenCalled()
      expect(res).toEqual([])
    })
  })

  describe('get', () => {
    it('should return the item that has given id', async () => {
      const getSpy = jest.fn().mockResolvedValue({
        data: {
          _id: 'marge',
          _type: 'io.cozy.simpsons',
          name: 'Marge Simpson'
        }
      })
      cozyClient.stackClient.collection.mockReturnValue({
        get: getSpy
      })
      const result = await Simpson.get('marge')
      expect(result).toEqual({
        _id: 'marge',
        _type: 'io.cozy.simpsons',
        name: 'Marge Simpson'
      })
    })

    it('should throw an error if no doctype is given', async () => {
      class VanHouten extends Document {}
      expect.assertions(1)
      await expect(VanHouten.get('milhouse')).rejects.toEqual(
        new Error('doctype is not defined')
      )
    })
  })
})
