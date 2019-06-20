import AdministrativeProcedure from './AdministrativeProcedure'

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
})
