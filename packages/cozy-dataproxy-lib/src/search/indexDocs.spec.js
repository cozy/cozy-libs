import { initSearchIndex } from './indexDocs'

describe('indexDocs', () => {
  it('should create a flexsearch index', () => {
    const flexsearchIndex = initSearchIndex('io.cozy.files')
    expect(flexsearchIndex).toBeDefined()
  })

  it('should correctly index a file on name', () => {
    const flexsearchIndex = initSearchIndex('io.cozy.files')
    const doc = {
      _id: '1',
      name: 'test'
    }
    flexsearchIndex.add(doc)
    expect(flexsearchIndex.search('test')).toEqual([
      {
        field: 'name',
        result: ['1']
      }
    ])
  })

  it('should correctly index a file on path', () => {
    const flexsearchIndex = initSearchIndex('io.cozy.files')
    const doc = {
      _id: '1',
      path: '/mypath/test'
    }
    flexsearchIndex.add(doc)
    expect(flexsearchIndex.search('test')).toEqual([
      {
        field: 'path',
        result: ['1']
      }
    ])
  })

  it('should correctly index string with accents thanks to encoder', () => {
    const flexsearchIndex = initSearchIndex('io.cozy.files')
    const doc1 = {
      _id: '1',
      name: 'ééébbb'
    }
    const doc2 = {
      _id: '2',
      name: 'àààbbb'
    }
    flexsearchIndex.add(doc1)
    flexsearchIndex.add(doc2)
    expect(flexsearchIndex.search('eeebb')).toEqual([
      {
        field: 'name',
        result: ['1']
      }
    ])

    expect(flexsearchIndex.search('ééé')).toEqual([
      {
        field: 'name',
        result: ['1']
      }
    ])
    expect(flexsearchIndex.search('aaa')).toEqual([
      {
        field: 'name',
        result: ['2']
      }
    ])
    expect(flexsearchIndex.search('ààà')).toEqual([
      {
        field: 'name',
        result: ['2']
      }
    ])
  })

  it('should correctly index tricky strings', () => {
    const flexsearchIndex = initSearchIndex('io.cozy.files')
    // The tokenizer will tokenize 'UI-UX' as ['UI', 'UX'], so it will work
    // only if the character length is at least 2
    const doc = {
      _id: '3',
      name: 'UI-UX Guideline.cozy-note'
    }
    flexsearchIndex.add(doc)
    expect(flexsearchIndex.search('UI-UX')).toEqual([
      {
        field: 'name',
        result: ['3']
      }
    ])
  })
})
