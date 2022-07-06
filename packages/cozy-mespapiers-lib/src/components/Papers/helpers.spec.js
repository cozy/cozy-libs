import {
  harmonizeContactsNames,
  groupFilesByContacts,
  buildFilesByContacts,
  getContactsRefIdsByFiles
} from './helpers'

const mockContacts00 = [
  { _id: 'contactId01', name: { givenName: 'Bob', familyName: 'Durand' } },
  { _id: 'contactId02', name: { givenName: 'Alice', familyName: 'Durand' } }
]
const mockContacts01 = [
  { _id: 'contactId01', name: { givenName: 'Bernard', familyName: 'Chabert' } }
]
const mockContacts02 = [
  { _id: 'contactId01', name: { givenName: 'Bernard', familyName: 'Chabert' } },
  { _id: 'contactId02', name: { givenName: 'Clair', familyName: 'Guillot' } }
]
const mockContacts03 = [
  { _id: 'contactId01', name: { givenName: 'Bernard', familyName: 'Chabert' } },
  { _id: 'contactId02', name: { givenName: 'Clair', familyName: 'Guillot' } },
  { _id: 'contactId03', name: { givenName: 'Jean', familyName: 'Rossi' } }
]

const mockFiles = [
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

const mockFilesWithoutContact = [
  {
    _id: 'fileId01',
    name: 'file01.pdf'
  },
  {
    _id: 'fileId02',
    name: 'file02.pdf'
  }
]

describe('helpers Papers', () => {
  describe('getContactsRefIdsByFiles', () => {
    it('should return list of contact ids', () => {
      const res = getContactsRefIdsByFiles(mockFiles)

      expect(res).toStrictEqual(['contactId01', 'contactId02'])
    })

    it('should return empty array if has no param', () => {
      const res = getContactsRefIdsByFiles()

      expect(res).toStrictEqual([])
    })
  })

  describe('harmonizeContactsNames', () => {
    it('should return the names of the merged contacts', () => {
      const res = harmonizeContactsNames(
        mockContacts00,
        jest.fn(key => key)
      )

      expect(res).toBe('PapersList.contactMerged')
    })

    it('should return the name of the contact', () => {
      const res = harmonizeContactsNames(
        mockContacts01,
        jest.fn(key => key)
      )

      expect(res).toBe('Bernard Chabert')
    })

    it('should return the names of the contacts separated by a comma', () => {
      const res = harmonizeContactsNames(
        mockContacts02,
        jest.fn(key => key)
      )

      expect(res).toBe('Bernard Chabert, Clair Guillot')
    })

    it('should return the names of the contacts separated by a comma and ... ', () => {
      const res = harmonizeContactsNames(
        mockContacts03,
        jest.fn(key => key)
      )

      expect(res).toBe('Bernard Chabert, Clair Guillot, ... ')
    })
  })

  describe('groupFilesByContacts', () => {
    it('should return an object that groups the files with their contacts', () => {
      const expected = [
        {
          contacts: [mockContacts00[0]],
          files: [mockFiles[0]]
        },
        {
          contacts: [mockContacts00[1]],
          files: [mockFiles[1]]
        },
        {
          contacts: [mockContacts00[0], mockContacts00[1]],
          files: [mockFiles[2]]
        },
        {
          contacts: [],
          files: [mockFiles[3]]
        }
      ]

      const res = groupFilesByContacts(mockFiles, mockContacts00)

      expect(res).toStrictEqual(expected)
    })
  })

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
        files: mockFiles,
        contacts: mockContacts00,
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
        files: mockFilesWithoutContact,
        contacts: mockContacts00,
        maxDisplay: 3,
        t: jest.fn(key => key)
      })

      expect(result).toStrictEqual(expected)
    })
  })
})
