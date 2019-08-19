const MockDate = require('mockdate')

const AdministrativeProcedure = require('./AdministrativeProcedure')

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
        ],
        maritalStatus: 'complicated',
        numberOfDependants: 3,
        additionalIncome: 0
      }
      const fields = [
        'lastname',
        'firstname',
        'salary',
        'address',
        'phone',
        'email',
        'maritalStatus',
        'numberOfDependants',
        'additionalIncome'
      ]
      const expected = {
        lastname: 'Targaryen',
        firstname: 'Daenerys',
        address: '94 Hinton Road 05034 Fresno, Singapore',
        phone: '+33 (2)0 90 00 54 04',
        email: 'daenerys@dragonstone.westeros',
        maritalStatus: 'complicated',
        numberOfDependants: 3,
        additionalIncome: 0
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
        documentsData: {
          address_certificate: {
            files: [
              {
                id: 'baac72edf28acadd',
                name: 'facture_edf.pdf',
                trashed: false
              },
              {
                id: '94bbda9a86b52c76',
                name: 'facture_fibre.pdf',
                trashed: false
              }
            ]
          },
          bank_identity: { files: [] },
          identity_document: {
            files: [
              {
                id: '979469aa60434433',
                name: 'carte_identite.png',
                trashed: false
              }
            ]
          }
        }
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
        submissionDate: new Date(MOCKED_DATE),
        templateId: 'credit-application',
        templateVersion: 1,
        relationships: {
          files: {
            data: [
              {
                _id: 'baac72edf28acadd',
                _type: 'io.cozy.files',
                templateDocumentId: 'address_certificate'
              },
              {
                _id: '94bbda9a86b52c76',
                _type: 'io.cozy.files',
                templateDocumentId: 'address_certificate'
              },
              {
                _id: '979469aa60434433',
                _type: 'io.cozy.files',
                templateDocumentId: 'identity_document'
              }
            ]
          }
        }
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
