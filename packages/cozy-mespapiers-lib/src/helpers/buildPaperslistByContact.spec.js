import { buildFilesByContacts } from './buildFilesByContacts'

const mockContactsList = [
  { _id: 'contactId01', name: { givenName: 'Bob', familyName: 'Durand' } },
  { _id: 'contactId02', name: { givenName: 'Alice', familyName: 'Durand' } }
]
const mockPapersList = [
  {
    _id: 'fileId01',
    name: 'file01.pdf',
    relationships: {
      referenced_by: { data: [{ id: 'contactId01', type: 'io.cozy.contacts' }] }
    }
  },
  {
    _id: 'fileId02',
    name: 'file02.pdf',
    relationships: {
      referenced_by: { data: [{ id: 'contactId02', type: 'io.cozy.contacts' }] }
    }
  },
  {
    _id: 'fileId03',
    name: 'file03.pdf',
    relationships: {
      referenced_by: {
        data: [
          { id: 'contactId01', type: 'io.cozy.contacts' },
          { id: 'contactId02', type: 'io.cozy.contacts' }
        ]
      }
    }
  },
  {
    _id: 'fileId04',
    name: 'file04.pdf'
  }
]

const mockPapersListWithoutContact = [
  {
    _id: 'fileId01',
    name: 'file01.pdf'
  },
  {
    _id: 'fileId02',
    name: 'file02.pdf'
  }
]

describe('buildFilesByContacts', () => {
  it('should return object with all papers filtered by contacts', () => {
    const expected = [
      {
        withHeader: true,
        contact: 'Alice Durand',
        papers: {
          maxDisplay: 3,
          list: [
            {
              _id: 'fileId02',
              name: 'file02.pdf',
              relationships: {
                referenced_by: {
                  data: [{ id: 'contactId02', type: 'io.cozy.contacts' }]
                }
              }
            }
          ]
        }
      },
      {
        withHeader: true,
        contact: 'Bob Durand',
        papers: {
          maxDisplay: 3,
          list: [
            {
              _id: 'fileId01',
              name: 'file01.pdf',
              relationships: {
                referenced_by: {
                  data: [{ id: 'contactId01', type: 'io.cozy.contacts' }]
                }
              }
            }
          ]
        }
      },
      {
        withHeader: true,
        contact: 'PapersList.contactMerged',
        papers: {
          maxDisplay: 3,
          list: [
            {
              _id: 'fileId03',
              name: 'file03.pdf',
              relationships: {
                referenced_by: {
                  data: [
                    { id: 'contactId01', type: 'io.cozy.contacts' },
                    { id: 'contactId02', type: 'io.cozy.contacts' }
                  ]
                }
              }
            }
          ]
        }
      },
      {
        withHeader: true,
        contact: 'PapersList.defaultName',
        papers: {
          maxDisplay: 3,
          list: [
            {
              _id: 'fileId04',
              name: 'file04.pdf'
            }
          ]
        }
      }
    ]

    const result = buildFilesByContacts({
      files: mockPapersList,
      contacts: mockContactsList,
      maxDisplay: 3,
      t: jest.fn(key => key)
    })

    expect(result).toStrictEqual(expected)
  })

  it('should have not header if there are only files without contact', () => {
    const expected = [
      {
        withHeader: false,
        contact: 'PapersList.defaultName',
        papers: {
          maxDisplay: 3,
          list: [
            {
              _id: 'fileId01',
              name: 'file01.pdf'
            },
            {
              _id: 'fileId02',
              name: 'file02.pdf'
            }
          ]
        }
      }
    ]

    const result = buildFilesByContacts({
      files: mockPapersListWithoutContact,
      contacts: mockContactsList,
      maxDisplay: 3,
      t: jest.fn(key => key)
    })

    expect(result).toStrictEqual(expected)
  })
})
