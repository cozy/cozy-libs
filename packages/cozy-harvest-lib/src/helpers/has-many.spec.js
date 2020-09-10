const { updateHasManyItem } = require('./has-many')

describe('has-many helpers', () => {
  it('should work', () => {
    const doc = {
      _id: 'doc-1',
      label: 'Document 1',
      relationships: {
        author: { data: { _id: 'author-1', _type: 'io.cozy.authors' } },
        books: {
          data: [
            { _id: 'book-1', _type: 'io.cozy.books' },
            { _id: 'book-2', _type: 'io.cozy.books' },
            { _id: 'book-3', _type: 'io.cozy.books' }
          ]
        }
      }
    }

    const doc2 = updateHasManyItem(doc, 'books', 'book-2', rel => {
      return { ...rel, meta: { read: true } }
    })

    const doc3 = updateHasManyItem(doc2, 'books', 'book-3', rel => {
      return { ...rel, meta: { read: true } }
    })

    expect(doc2).toMatchSnapshot()
    expect(doc3).toMatchSnapshot()
  })
})
