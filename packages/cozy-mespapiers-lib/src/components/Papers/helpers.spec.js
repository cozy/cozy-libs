import {
  harmonizeContactsNames,
  groupFilesByContacts,
  buildFilesByContacts,
  getContactsRefIdsByFiles,
  buildFilesWithContacts,
  getCurrentQualificationLabel,
  makeAccountFromPapers,
  generateReturnUrlToNotesIndex
} from './helpers'

// see https://remarkablemark.org/blog/2018/11/17/mock-window-location/
const { location } = window
function setLocation(url) {
  delete window.location
  window.location = url
}
function restoreLocation() {
  window.location = location
}

const mockContacts00 = [
  {
    _id: 'contactId01',
    name: { givenName: 'Bob', familyName: 'Durand' },
    me: true
  },
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

const mockFilesWithContacts = [
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
  }
]

const mockUnspecifiedFiles = [
  {
    _id: 'fileId04',
    name: 'file04.pdf'
  },
  {
    _id: 'fileId08',
    name: 'file08.pdf'
  }
]

const mockFilesWithSourceAccount = [
  {
    _id: 'fileId05',
    name: 'file05.pdf',
    cozyMetadata: {
      sourceAccount: 'KonnectorAccountId01',
      sourceAccountIdentifier: 'Account 1',
      createdByApp: 'KonnectorOne'
    }
  },
  {
    _id: 'fileId06',
    name: 'file06.pdf',
    cozyMetadata: {
      sourceAccount: 'KonnectorAccountId01',
      sourceAccountIdentifier: 'Account 1',
      createdByApp: 'KonnectorOne'
    }
  },
  {
    _id: 'fileId07',
    name: 'file07.pdf',
    cozyMetadata: {
      sourceAccount: 'KonnectorAccountId02',
      sourceAccountIdentifier: 'Account 2',
      createdByApp: 'KonnectorTwo'
    }
  }
]

const mockFilesWithContactsAndSourceAccount = [
  {
    _id: 'fileId09',
    name: 'file09pdf',
    cozyMetadata: {
      sourceAccount: 'KonnectorAccountId02',
      sourceAccountIdentifier: 'Account 2',
      createdByApp: 'KonnectorTwo'
    },
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

describe('helpers Papers', () => {
  describe('getContactsRefIdsByFiles', () => {
    it('should return list of contact ids', () => {
      const res = getContactsRefIdsByFiles(mockFilesWithContacts)

      expect(res).toStrictEqual(['contactId01', 'contactId02'])
    })

    it('should return empty array if param is undefined', () => {
      const res = getContactsRefIdsByFiles()

      expect(res).toStrictEqual([])
    })

    it('should return empty array if param is null', () => {
      const res = getContactsRefIdsByFiles(null)

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
          files: [mockFilesWithContacts[0]],
          withMyself: true
        },
        {
          contacts: [mockContacts00[1]],
          files: [mockFilesWithContacts[1]],
          withMyself: false
        },
        {
          contacts: [mockContacts00[0], mockContacts00[1]],
          files: [mockFilesWithContacts[2]],
          withMyself: true
        },
        {
          contacts: [],
          files: [mockUnspecifiedFiles[0], mockUnspecifiedFiles[1]],
          withMyself: false
        }
      ]

      const res = groupFilesByContacts(
        [...mockFilesWithContacts, ...mockUnspecifiedFiles],
        mockContacts00
      )

      expect(res).toStrictEqual(expected)
    })
  })

  describe('buildFilesByContacts', () => {
    it('should return object with all papers filtered by contacts', () => {
      const expected = [
        {
          withHeader: true,
          contact: 'Bob Durand',
          withMyself: true,
          papers: {
            maxDisplay: 3,
            list: [mockFilesWithContacts[0]]
          }
        },
        {
          withHeader: true,
          contact: 'PapersList.contactMerged',
          withMyself: true,
          papers: {
            maxDisplay: 3,
            list: [mockFilesWithContacts[2]]
          }
        },
        {
          withHeader: true,
          contact: 'Alice Durand',
          withMyself: false,
          papers: {
            maxDisplay: 3,
            list: [mockFilesWithContacts[1]]
          }
        },
        {
          withHeader: true,
          contact: 'PapersList.defaultName',
          withMyself: false,
          papers: {
            maxDisplay: 3,
            list: [mockUnspecifiedFiles[0], mockUnspecifiedFiles[1]]
          }
        }
      ]

      const result = buildFilesByContacts({
        files: [...mockFilesWithContacts, ...mockUnspecifiedFiles],
        konnectors: undefined,
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
          withMyself: false,
          papers: {
            maxDisplay: 3,
            list: [mockUnspecifiedFiles[0], mockUnspecifiedFiles[1]]
          }
        }
      ]

      const result = buildFilesByContacts({
        files: mockUnspecifiedFiles,
        konnector: undefined,
        contacts: mockContacts00,
        maxDisplay: 3,
        t: jest.fn(key => key)
      })

      expect(result).toStrictEqual(expected)
    })

    it('should return object with all papers filtered by konnector', () => {
      const result = buildFilesByContacts({
        files: [...mockFilesWithSourceAccount, ...mockUnspecifiedFiles],
        konnectors: [{ slug: 'KonnectorOne' }, { slug: 'KonnectorTwo' }],
        contacts: [],
        maxDisplay: 3,
        t: jest.fn(key => key)
      })

      const expected = [
        {
          withHeader: true,
          konnector: { slug: 'KonnectorOne' },
          contact: 'PapersList.accountName',
          withMyself: false,
          papers: {
            maxDisplay: 3,
            list: [mockFilesWithSourceAccount[0], mockFilesWithSourceAccount[1]]
          }
        },
        {
          withHeader: true,
          konnector: { slug: 'KonnectorTwo' },
          contact: 'PapersList.accountName',
          withMyself: false,
          papers: {
            maxDisplay: 3,
            list: [mockFilesWithSourceAccount[2]]
          }
        },
        {
          withHeader: true,
          contact: 'PapersList.defaultName',
          withMyself: false,
          papers: {
            maxDisplay: 3,
            list: [mockUnspecifiedFiles[0], mockUnspecifiedFiles[1]]
          }
        }
      ]

      expect(result).toStrictEqual(expected)
    })

    it('should filter files with contact and without contact', () => {
      const result = buildFilesByContacts({
        files: [
          ...mockFilesWithContacts,
          ...mockFilesWithSourceAccount,
          ...mockFilesWithContactsAndSourceAccount
        ],
        konnectors: [{ slug: 'KonnectorOne' }, { slug: 'KonnectorTwo' }],
        contacts: mockContacts00,
        maxDisplay: 3,
        t: jest.fn(key => key)
      })

      const expected = [
        {
          withHeader: true,
          konnector: { slug: 'KonnectorOne' },
          contact: 'PapersList.accountName',
          withMyself: false,
          papers: {
            maxDisplay: 3,
            list: [mockFilesWithSourceAccount[0], mockFilesWithSourceAccount[1]]
          }
        },
        {
          withHeader: true,
          konnector: { slug: 'KonnectorTwo' },
          contact: 'PapersList.accountName',
          withMyself: false,
          papers: {
            maxDisplay: 3,
            list: [
              mockFilesWithSourceAccount[2],
              mockFilesWithContactsAndSourceAccount[0]
            ]
          }
        },
        {
          withHeader: true,
          contact: 'Bob Durand',
          withMyself: true,
          papers: {
            maxDisplay: 3,
            list: [mockFilesWithContacts[0]]
          }
        },
        {
          withHeader: true,
          contact: 'PapersList.contactMerged',
          withMyself: true,
          papers: {
            maxDisplay: 3,
            list: [mockFilesWithContacts[2]]
          }
        },
        {
          withHeader: true,
          contact: 'Alice Durand',
          withMyself: false,
          papers: {
            maxDisplay: 3,
            list: [mockFilesWithContacts[1]]
          }
        }
      ]

      expect(result).toStrictEqual(expected)
    })
  })

  describe('buildFilesWithContacts', () => {
    it('should return an array of objects grouping the files with the associated contact names', () => {
      const expected = [
        {
          file: mockFilesWithContacts[0],
          contact: 'Bob Durand'
        },
        {
          file: mockFilesWithContacts[1],
          contact: 'Alice Durand'
        },
        {
          file: mockFilesWithContacts[2],
          contact: 'PapersList.contactMerged'
        },
        {
          file: mockUnspecifiedFiles[0],
          contact: undefined
        },
        {
          file: mockUnspecifiedFiles[1],
          contact: undefined
        }
      ]

      const result = buildFilesWithContacts({
        files: [...mockFilesWithContacts, ...mockUnspecifiedFiles],
        contacts: mockContacts00,
        t: jest.fn(key => key)
      })

      expect(result).toStrictEqual(expected)
    })
  })
})

describe('getCurrentQualificationLabel', () => {
  it('should be "qualificationLabel" event with selectedQualificationLabel', () => {
    const res = getCurrentQualificationLabel(
      { qualificationLabel: 'qualificationLabel' },
      'selectedQualificationLabel'
    )

    expect(res).toBe('qualificationLabel')
  })

  it('should qualificationLabel with null selectedQualificationLabel', () => {
    const res = getCurrentQualificationLabel(
      { qualificationLabel: 'qualificationLabel' },
      null
    )

    expect(res).toBe('qualificationLabel')
  })

  it('should be selectedQualificationLabel for null qualificationLabel', () => {
    const res = getCurrentQualificationLabel(
      { qualificationLabel: null },
      'selectedQualificationLabel'
    )

    expect(res).toBe('selectedQualificationLabel')
  })

  it('should be selectedQualificationLabel fro null param', () => {
    const res = getCurrentQualificationLabel(null, 'selectedQualificationLabel')

    expect(res).toBe('selectedQualificationLabel')
  })

  it('should be null', () => {
    const res = getCurrentQualificationLabel(null, null)

    expect(res).toBe(null)
  })
})

describe('makeAccountFromPapers', () => {
  it('should be undefined if no argument', () => {
    const res = makeAccountFromPapers()

    expect(res).toBe(undefined)
  })

  it('should be undefined if no papers', () => {
    const res = makeAccountFromPapers(undefined, [
      { auth: { login: 'myLogin' } }
    ])

    expect(res).toBe(undefined)
  })

  it('should be undefined if papers with no list', () => {
    const res = makeAccountFromPapers({ list: undefined }, [
      { auth: { login: 'myLogin' } }
    ])

    expect(res).toBe(undefined)
  })

  it('should be undefined if papers with empty list', () => {
    const res = makeAccountFromPapers({ list: [] }, [
      { auth: { login: 'myLogin' } }
    ])

    expect(res).toBe(undefined)
  })

  it('should be undefined if no accounts', () => {
    const res = makeAccountFromPapers(
      { list: [{ cozyMetadata: { sourceAccountIdentifier: 'myLogin' } }] },
      undefined
    )

    expect(res).toBe(undefined)
  })

  it('should be undefined if no match', () => {
    const res = makeAccountFromPapers(
      { list: [{ cozyMetadata: { sourceAccountIdentifier: 'myLogin' } }] },
      [{ auth: { login: 'myOtherLogin' } }]
    )

    expect(res).toBe(undefined)
  })

  it('should return the account', () => {
    const res = makeAccountFromPapers(
      { list: [{ cozyMetadata: { sourceAccountIdentifier: 'myLogin' } }] },
      [{ auth: { login: 'myLogin' } }]
    )

    expect(res).toStrictEqual({ auth: { login: 'myLogin' } })
  })
})

describe('generateReturnUrlToNotesIndex', () => {
  function createFetchUrl() {
    return jest.fn().mockImplementation(({ _id }) => ({
      data: {
        type: 'io.cozy.notes.url',
        id: _id,
        note_id: _id,
        subdomain: 'flat',
        protocol: 'https',
        instance: 'alice.cozy.example',
        public_name: 'Bob'
      }
    }))
  }

  function createClient() {
    return {
      getStackClient: () => ({
        collection: () => ({ fetchURL: createFetchUrl() })
      })
    }
  }

  function createNote(id = '12345') {
    return { id, type: 'io.cozy.files' }
  }

  afterEach(() => {
    restoreLocation()
  })

  it('returns an URL string', async () => {
    const client = createClient()
    const note = createNote()
    const urlString = await generateReturnUrlToNotesIndex(client, note)
    const url = new URL(urlString)
    expect(url.toString()).toEqual(urlString)
  })

  it('has a returnUrl key', async () => {
    const location = 'htt://google.com/index?param=value#hash'
    setLocation(location)
    const client = createClient()
    const note = createNote()
    const urlString = await generateReturnUrlToNotesIndex(client, note)
    const url = new URL(urlString)
    expect(url.searchParams.get('returnUrl')).toEqual(location)
  })
})
