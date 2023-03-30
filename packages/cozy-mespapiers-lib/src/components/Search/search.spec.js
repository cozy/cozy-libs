import get from 'lodash/get'

import {
  makeFileTags,
  makeContactTags,
  addFileDoc,
  addContactDoc
} from './search'

const locales = {
  items: {
    tax_return: 'Impôts - Déclaration de revenus'
  }
}

const scannerT = x => get(locales, x)
const index = { add: jest.fn() }

describe('makeFileTags', () => {
  it('should return the theme label of tax_return qualification', () => {
    const res = makeFileTags({
      metadata: { qualification: { label: 'tax_return' } }
    })

    expect(res).toStrictEqual(['finance'])
  })

  it('should return the theme labels of driver_license qualification', () => {
    const res = makeFileTags({
      metadata: { qualification: { label: 'driver_license' } }
    })

    expect(res).toStrictEqual(['identity', 'transport'])
  })

  it('should return empty array if no qualification', () => {
    const res = makeFileTags({ metadata: {} })

    expect(res).toStrictEqual([])
  })
})

describe('makeContactTags', () => {
  it('should return the theme label `identity` for a contact with a given name', () => {
    const res = makeContactTags({ name: { givenName: 'Jason' } })

    expect(res).toStrictEqual(['identity'])
  })

  it('should return the theme label `work_study` for a contact with a company', () => {
    const res = makeContactTags({ company: 'Cozy' })

    expect(res).toStrictEqual(['work_study'])
  })

  it('should return the theme labels for a contact with an address', () => {
    const res = makeContactTags({
      address: [{ formattedAddress: '2 place Victor Hugo' }]
    })

    expect(res).toStrictEqual(['home', 'work_study', 'identity'])
  })
})

describe('addFileDoc', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should use a doc with correct flexsearchProps', () => {
    addFileDoc(
      index,
      {
        _type: 'io.cozy.files',
        name: 'file01.ext',
        metadata: { qualification: { label: 'tax_return' } }
      },
      scannerT
    )

    expect(index.add).toBeCalledWith({
      _type: 'io.cozy.files',
      name: 'file01.ext',
      metadata: { qualification: { label: 'tax_return' } },
      flexsearchProps: {
        tag: ['finance'],
        translatedQualificationLabel: 'Impôts - Déclaration de revenus'
      }
    })
  })
})

describe('addContactDoc', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should use a doc with correct flexsearchProps', () => {
    addContactDoc(index, {
      _type: 'io.cozy.contacts',
      name: { givenName: 'Jason', familyName: 'Bourne' },
      fullname: 'Jason Bourne',
      birthday: '1959-05-15',
      birthcity: 'Chicago',
      email: [{ address: 'jason.bourne@aol.com' }],
      civility: 'male',
      company: 'CIA',
      jobTitle: 'Facilitator'
    })

    expect(index.add).toBeCalledWith({
      _type: 'io.cozy.contacts',
      name: { givenName: 'Jason', familyName: 'Bourne' },
      fullname: 'Jason Bourne',
      birthday: '1959-05-15',
      birthcity: 'Chicago',
      email: [{ address: 'jason.bourne@aol.com' }],
      civility: 'male',
      company: 'CIA',
      jobTitle: 'Facilitator',
      flexsearchProps: {
        tag: ['identity', 'work_study'],
        'email[0].address': 'jason.bourne@aol.com'
      }
    })
  })
})
