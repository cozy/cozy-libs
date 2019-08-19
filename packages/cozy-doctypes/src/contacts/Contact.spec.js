const Contact = require('./Contact')

describe('Contact model', () => {
  describe('isContact method', () => {
    it('should return true if candidate is a contact', () => {
      const candidate = {
        _id: '36cd8707-9ab9',
        _type: 'io.cozy.contacts',
        name: {
          givenName: 'Jaime',
          familyName: 'Lannister'
        }
      }
      const result = Contact.isContact(candidate)
      expect(result).toBe(true)
    })

    it('should return false if candidate is not a contact', () => {
      const candidate = {
        foo: 'bar'
      }
      const result = Contact.isContact(candidate)
      expect(result).toBe(false)
    })
  })

  describe('getInitials method', () => {
    it("should return the contact's initials from the name", () => {
      const contact = {
        name: {
          givenName: 'Arya',
          familyName: 'Stark'
        }
      }
      const result = Contact.getInitials(contact)
      expect(result).toEqual('AS')
    })

    it("should return the contact's initials if contact has only givenName", () => {
      const contact = {
        name: {
          givenName: 'Arya'
        }
      }
      const result = Contact.getInitials(contact)
      expect(result).toEqual('A')
    })

    it("should return the contact's initials if contact has only familyName", () => {
      const contact = {
        name: {
          familyName: 'Stark'
        }
      }
      const result = Contact.getInitials(contact)
      expect(result).toEqual('S')
    })

    it('should return the first letter of the primary email if contact has no name', () => {
      const contact = {
        name: undefined,
        email: [
          {
            address: 'arya.stark@thenorth.westeros',
            primary: true
          }
        ]
      }
      const result = Contact.getInitials(contact)
      expect(result).toEqual('A')
    })

    it('should return the first letter if input is a string', () => {
      const result = Contact.getInitials('arya.stark@thenorth.westeros')
      expect(result).toEqual('A')
    })

    it('should return an empty string if contact has no name/email', () => {
      const result = Contact.getInitials({})
      expect(result).toEqual('')
    })
  })

  describe('getPrimaryEmail', () => {
    it('should return the main email', () => {
      const contact = {
        email: [
          {
            address: 'beth@braavos.essos',
            primary: false
          },
          {
            address: 'arya.stark@thenorth.westeros',
            primary: true
          }
        ]
      }
      const result = Contact.getPrimaryEmail(contact)
      expect(result).toEqual('arya.stark@thenorth.westeros')
    })

    it('should return the first if there is no primary', () => {
      const contact = {
        email: [
          {
            address: 'beth@braavos.essos'
          },
          {
            address: 'arya.stark@thenorth.westeros'
          }
        ]
      }
      const result = Contact.getPrimaryEmail(contact)
      expect(result).toEqual('beth@braavos.essos')
    })

    it('should work with old doctype', () => {
      const contact = {
        email: 'arya.stark@thenorth.westeros'
      }
      const result = Contact.getPrimaryEmail(contact)
      expect(result).toEqual('arya.stark@thenorth.westeros')
    })
  })

  describe('getPrimaryCozy', () => {
    it('should return the main cozy', () => {
      const contact = {
        cozy: [
          {
            url: 'https://arya.mycozy.cloud',
            primary: true
          },
          {
            url: 'https://beth.mycozy.cloud',
            primary: false
          }
        ]
      }
      const result = Contact.getPrimaryCozy(contact)
      expect(result).toEqual('https://arya.mycozy.cloud')
    })

    it('should return the first if there is no primary', () => {
      const contact = {
        cozy: [
          {
            url: 'https://arya.mycozy.cloud'
          },
          {
            url: 'https://beth.mycozy.cloud'
          }
        ]
      }
      const result = Contact.getPrimaryCozy(contact)
      expect(result).toEqual('https://arya.mycozy.cloud')
    })

    it('should work with old doctype', () => {
      const contact = {
        url: 'https://arya.mycozy.cloud'
      }
      const result = Contact.getPrimaryCozy(contact)
      expect(result).toEqual('https://arya.mycozy.cloud')
    })
  })

  describe('getPrimaryPhone', () => {
    it('should return the main phone number', () => {
      const contact = {
        phone: [
          { number: '0320007788', primary: true },
          { number: '0666001122', primary: false },
          { number: '0788996677', primary: false }
        ]
      }
      const result = Contact.getPrimaryPhone(contact)
      expect(result).toEqual('0320007788')
    })
  })

  describe('getPrimaryAddress', () => {
    it('should return the main phone number', () => {
      const contact = {
        name: {
          givenName: 'Arya',
          familyName: 'Stark'
        },
        address: [
          { formattedAddress: 'Winterfell', primary: true },
          { formattedAddress: 'Braavos', primary: false },
          { formattedAddress: "The Streets of King's Landing", primary: false }
        ]
      }
      const result = Contact.getPrimaryAddress(contact)
      expect(result).toEqual('Winterfell')
    })
  })

  describe('getFullname function', () => {
    it("should return contact's fullname", () => {
      const contact = {
        fullname: 'Doran Martell',
        name: {
          givenName: 'Do',
          familyName: 'Martell'
        }
      }
      const result = Contact.getFullname(contact)
      expect(result).toEqual('Doran Martell')
    })

    it('should combine all name parts', () => {
      const contact = {
        fullname: '',
        name: {
          namePrefix: 'The Mother of Dragons',
          givenName: 'Daenerys',
          additionalName: 'The Unburnt',
          familyName: 'Targaryen',
          nameSuffix: 'Breaker of Chains'
        }
      }
      const result = Contact.getDisplayName(contact)
      expect(result).toEqual(
        'The Mother of Dragons Daenerys The Unburnt Targaryen Breaker of Chains'
      )
    })

    it("should return contact's givenName + familyName if no fullname", () => {
      const contact = {
        fullname: undefined,
        name: {
          givenName: 'Doran',
          familyName: 'Martell'
        }
      }
      const result = Contact.getFullname(contact)
      expect(result).toEqual('Doran Martell')
    })

    it("should return contact's givenName if no familyName", () => {
      const contact = {
        fullname: undefined,
        name: {
          givenName: 'Doran',
          familyName: ''
        }
      }
      const result = Contact.getFullname(contact)
      expect(result).toEqual('Doran')
    })

    it("should return contact's familyName if no givenName", () => {
      const contact = {
        fullname: undefined,
        name: {
          givenName: '',
          familyName: 'Martell'
        }
      }
      const result = Contact.getFullname(contact)
      expect(result).toEqual('Martell')
    })
  })

  describe('getDisplayName function', () => {
    it("should return the contact's fullname if any", () => {
      const contact = {
        fullname: 'Doran Martell',
        name: {
          givenName: 'Doran',
          familyName: 'Martell'
        },
        email: [
          {
            address: 'doran.martell@dorne.westeros',
            primary: true
          }
        ]
      }
      const result = Contact.getDisplayName(contact)
      expect(result).toEqual('Doran Martell')
    })

    it("should return the contact's name if no fullname", () => {
      const contact = {
        fullname: '',
        name: {
          givenName: 'Doran',
          familyName: 'Martell'
        },
        email: [
          {
            address: 'doran.martell@dorne.westeros',
            primary: true
          }
        ]
      }
      const result = Contact.getDisplayName(contact)
      expect(result).toEqual('Doran Martell')
    })

    it("should return the contact's primary email if no fullname and no name", () => {
      const contact = {
        fullname: undefined,
        name: undefined,
        email: [
          {
            address: 'doran.martell@dorne.westeros',
            primary: true
          }
        ]
      }
      const result = Contact.getDisplayName(contact)
      expect(result).toEqual('doran.martell@dorne.westeros')
    })
  })
})
