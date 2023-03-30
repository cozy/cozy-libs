import get from 'lodash/get'

import { addFileDoc, addContactDoc } from './search'

const locales = {
  items: {
    tax_return: 'Impôts - Déclaration de revenus'
  }
}

const scannerT = x => get(locales, x)
const index = { add: jest.fn() }

describe('addFileDoc', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should use a doc with correct flexsearchProps', () => {
    addFileDoc({
      index,
      doc: {
        _type: 'io.cozy.files',
        name: 'file01.ext',
        metadata: { qualification: { label: 'tax_return' } }
      },
      scannerT
    })

    expect(index.add).toBeCalledWith({
      _type: 'io.cozy.files',
      name: 'file01.ext',
      metadata: { qualification: { label: 'tax_return' } },
      flexsearchProps: {
        tag: ['finance'],
        translated: {
          qualificationLabel: 'Impôts - Déclaration de revenus'
        }
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
