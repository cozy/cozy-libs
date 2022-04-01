import { buildPaperslistByContact } from 'src/helpers/buildPaperslistByContact'

const mockContactsList = [
  { _id: 'contactId01', displayName: 'Bob' },
  { _id: 'contactId02', displayName: 'Alice' }
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
      referenced_by: { data: [{ id: 'contactId01', type: 'io.cozy.contacts' }] }
    }
  }
]
const mockPapersDefinitions = [{ label: 'passport', maxDisplay: 2 }]

describe('buildPaperslistByContact', () => {
  it('should return object with all papers filtered by contacts', () => {
    const expected = [
      {
        withHeader: true,
        contact: 'Alice',
        papers: {
          maxDisplay: 2,
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
        contact: 'Bob',
        papers: {
          maxDisplay: 2,
          list: [
            {
              _id: 'fileId01',
              name: 'file01.pdf',
              relationships: {
                referenced_by: {
                  data: [{ id: 'contactId01', type: 'io.cozy.contacts' }]
                }
              }
            },
            {
              _id: 'fileId03',
              name: 'file03.pdf',
              relationships: {
                referenced_by: {
                  data: [{ id: 'contactId01', type: 'io.cozy.contacts' }]
                }
              }
            }
          ]
        }
      }
    ]

    const result = buildPaperslistByContact({
      papersList: mockPapersList,
      contactsList: mockContactsList,
      papersDefinitions: mockPapersDefinitions,
      currentFileCategory: 'passport'
    })

    expect(result).toEqual(expected)
  })
})
