import MockDate from 'mockdate'

import AdministrativeProcedure from './AdministrativeProcedure'

const MOCKED_DATE = '2018-01-01T12:00:00.210Z'

beforeAll(() => {
  MockDate.set(MOCKED_DATE)
})

afterAll(() => {
  jest.restoreAllMocks()
  MockDate.reset()
})

describe('AdministrativeProcedure model', () => {
  describe('getPersonalData', () => {
    it('should return the personal data for the given contact', () => {
      const dany = {
        fullname: '',
        name: {
          givenName: 'Daenerys',
          familyName: 'Targaryen'
        },
        phone: [
          {
            number: '+33 (2)0 90 00 54 04',
            primary: true
          },
          {
            number: '+33 6 77 11 22 33',
            primary: false
          }
        ],
        address: [
          {
            formattedAddress: '94 Hinton Road 05034 Fresno, Singapore',
            type: 'Home',
            primary: true
          },
          {
            street: '426 Runolfsson Knolls',
            city: 'Port Easter',
            country: 'Cocos (Keeling) Islands',
            postcode: '84573',
            type: 'Work'
          }
        ],
        email: [
          {
            address: 'dany@dragons.com',
            type: 'personal',
            primary: false
          },
          {
            address: 'daenerys@dragonstone.westeros',
            primary: true
          }
        ]
      }
      const fields = [
        'lastname',
        'firstname',
        'salary',
        'address',
        'phone',
        'email'
      ]
      const expected = {
        lastname: 'Targaryen',
        firstname: 'Daenerys',
        address: '94 Hinton Road 05034 Fresno, Singapore',
        phone: '+33 (2)0 90 00 54 04',
        email: 'daenerys@dragonstone.westeros'
      }
      const result = AdministrativeProcedure.getPersonalData(dany, fields)
      expect(result).toEqual(expected)
    })
  })

  describe('create', () => {
    it('should return an io.cozy.procedures.administratives object', () => {
      const data = {
        procedureData: {
          amount: 5000,
          duration: 36
        },
        personalData: {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@me.com'
        },
        documents: []
      }
      const template = {
        type: 'credit-application',
        version: 1
      }
      const result = AdministrativeProcedure.create(data, template)
      expect(result).toEqual({
        procedureData: {
          amount: 5000,
          duration: 36
        },
        personalData: {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@me.com'
        },
        documents: [],
        submissionDate: new Date(MOCKED_DATE),
        templateId: 'credit-application',
        templateVersion: 1
      })
    })
  })

  describe('createJson', () => {
    it('should return the json for this procedure', () => {
      const procedure = {
        procedureData: {
          amount: 5000,
          duration: 36
        },
        personalData: {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@me.com'
        },
        documents: [],
        submissionDate: new Date(MOCKED_DATE),
        templateId: 'credit-application',
        templateVersion: 1
      }
      const result = AdministrativeProcedure.createJson(procedure)
      // turn the json back to an object for snapshot readability
      expect(JSON.parse(result)).toMatchSnapshot()
    })
  })
})
