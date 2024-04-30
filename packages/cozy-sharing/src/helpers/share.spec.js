import { getSuccessMessage, countNewRecipients, getErrorMessage } from './share'

describe('share', () => {
  describe('getSuccessMessage', () => {
    const props = {
      currentRecipients: [{ email: 'sansa.stark@winterfell.westeros' }],
      documentType: 'Files',
      sharingDesc: 'fake-doc.odt',
      onShare: jest.fn(),
      createContact: jest.fn()
    }

    it('should return a success message and its params for multiple recipients', () => {
      const recipientsAfter = [
        { _type: 'io.cozy.contacts', email: 'jon.snow@thewall.westeros' },
        { _type: 'io.cozy.contacts', email: 'arya.stark@winterfell.westeros' },
        { _type: 'io.cozy.contacts', email: 'sansa.stark@winterfell.westeros' }
      ]
      const [message, params] = getSuccessMessage(
        props.currentRecipients,
        recipientsAfter,
        props.documentType
      )
      expect(message).toEqual('Files.share.shareByEmail.contactSuccess')
      expect(params).toEqual({ smart_count: 2 })
    })

    it('should return a success message and its params for one recipient with email', () => {
      const recipientsBefore = props.currentRecipients
      const [message, params] = getSuccessMessage(
        recipientsBefore,
        [{ email: 'jon.snow@thewall.westeros' }],
        props.documentType
      )
      expect(message).toEqual('Files.share.shareByEmail.singleContactSuccess')
      expect(params).toEqual({ email: 'jon.snow@thewall.westeros' })
    })

    it('should return a success message and its params for one recipient (contact) with email', () => {
      const recipientsBefore = props.currentRecipients
      const [message, params] = getSuccessMessage(
        recipientsBefore,
        [
          {
            _id: 'e8c0e15f-da7d',
            _type: 'io.cozy.contacts',
            fullname: 'Jon Snow',
            email: [
              {
                address: 'jon.snow@thewall.westeros',
                primary: true
              },
              {
                address: 'jon.snow@winterfell.westeros',
                primary: false
              }
            ]
          }
        ],
        props.documentType
      )
      expect(message).toEqual('Files.share.shareByEmail.singleContactSuccess')
      expect(params).toEqual({ email: 'jon.snow@thewall.westeros' })
    })

    it('should return a success message and its params for one recipient with cozy', () => {
      const recipientsBefore = props.currentRecipients
      const [message, params] = getSuccessMessage(
        recipientsBefore,
        [
          {
            cozy: [
              {
                url: 'https://doranmartell.mycozy.cloud'
              }
            ]
          }
        ],
        props.documentType
      )
      expect(message).toEqual('Files.share.shareByEmail.singleContactSuccess')
      expect(params).toEqual({ email: 'https://doranmartell.mycozy.cloud' })
    })

    it('should use contact success message if recipient has no email and no cozy', () => {
      const recipientsBefore = props.currentRecipients
      const [message, params] = getSuccessMessage(
        recipientsBefore,
        [
          {
            _id: 'fcb16b9e-7421'
          }
        ],
        props.documentType
      )
      expect(message).toEqual('Files.share.shareByEmail.contactSuccess')
      expect(params).toEqual({ smart_count: 1 })
    })

    it('should use single group success message if recipient is a group', () => {
      const recipientsBefore = props.currentRecipients
      const [message, params] = getSuccessMessage(
        recipientsBefore,
        [
          {
            _type: 'io.cozy.contacts.groups',
            name: 'Stark family'
          }
        ],
        props.documentType
      )
      expect(message).toEqual('Files.share.shareByEmail.singleGroupSuccess')
      expect(params).toEqual({ groupName: 'Stark family' })
    })

    it('should use contact success message if recipient has only multiple contacts', () => {
      const recipientsBefore = props.currentRecipients
      const [message, params] = getSuccessMessage(
        recipientsBefore,
        [
          {
            _type: 'io.cozy.contacts'
          },
          {
            _type: 'io.cozy.contacts'
          },
          {
            _type: 'io.cozy.contacts'
          }
        ],
        props.documentType
      )
      expect(message).toEqual('Files.share.shareByEmail.contactSuccess')
      expect(params).toEqual({ smart_count: 3 })
    })

    it('should use group success message if recipient has only multiple groups', () => {
      const recipientsBefore = props.currentRecipients
      const [message, params] = getSuccessMessage(
        recipientsBefore,
        [
          {
            _type: 'io.cozy.contacts.groups'
          },
          {
            _type: 'io.cozy.contacts.groups'
          }
        ],
        props.documentType
      )
      expect(message).toEqual('Files.share.shareByEmail.groupSuccess')
      expect(params).toEqual({ smart_count: 2 })
    })

    it('should use contact and group success message if recipient has multiple contacts and groups', () => {
      const recipientsBefore = props.currentRecipients
      const [message, params] = getSuccessMessage(
        recipientsBefore,
        [
          {
            _type: 'io.cozy.contacts'
          },
          {
            _id: 'fcb16b9e-7421',
            _type: 'io.cozy.contacts.groups'
          },
          {
            _id: 'f45b16be-7523',
            _type: 'io.cozy.contacts.groups'
          }
        ],
        props.documentType
      )
      expect(message).toEqual('Files.share.shareByEmail.contactAndGroupSuccess')
      expect(params).toEqual({ nbContact: 1, nbGroup: 2 })
    })
  })

  describe('countNewRecipients', () => {
    const currentRecipients = [
      {
        email: 'arya.stark@winterfell.westeros'
      },
      {
        email: 'sansa.stark@winterfell.westeros'
      },
      {
        email: 'jon.snow@thewall.westeros'
      }
    ]
    const addedRecipients = [
      {
        _id: 'e8c0e15f-da7d',
        _type: 'io.cozy.contacts',
        fullname: 'Jon Snow',
        email: [
          {
            address: 'jon.snow@thewall.westeros',
            primary: true
          },
          {
            address: 'jon.snow@winterfell.westeros',
            primary: false
          }
        ]
      },
      {
        _id: 'fcb16b9e-7421',
        _type: 'io.cozy.contacts'
      },
      {
        _id: 'f45b16be-7523',
        _type: 'io.cozy.contacts',
        cozy: [
          {
            url: 'https://doranmartell.mycozy.cloud'
          }
        ]
      }
    ]

    it('should count the new recipients with email', () => {
      const result = countNewRecipients(currentRecipients, addedRecipients)
      expect(result.contact).toEqual(2)
      expect(result.group).toEqual(0)
    })

    it('should count the new recipients with cozy url', () => {
      const currentRecipients = [
        {
          instance: 'https://bran.mycozy.cloud'
        },
        {
          instance: 'https://jon.mycozy.cloud'
        }
      ]
      const addedRecipients = [
        {
          _type: 'io.cozy.contacts',
          cozy: [
            {
              url: 'https://jon.mycozy.cloud',
              type: 'primary'
            }
          ]
        },
        {
          _type: 'io.cozy.contacts',
          cozy: [
            {
              url: 'https://sansa.mycozy.cloud',
              type: 'primary'
            }
          ]
        },
        {
          _type: 'io.cozy.contacts',
          cozy: [
            {
              url: 'https://bran.mycozy.cloud',
              type: 'primary'
            }
          ]
        },
        {
          _type: 'io.cozy.contacts',
          cozy: [
            {
              url: 'https://arya.mycozy.cloud',
              type: 'primary'
            }
          ]
        }
      ]
      const result = countNewRecipients(currentRecipients, addedRecipients)
      expect(result.contact).toEqual(2)
      expect(result.group).toEqual(0)
    })

    it('should count the new recipients with groups', () => {
      const result = countNewRecipients(currentRecipients, [
        ...addedRecipients,
        { _id: 'f45b16be-7523', _type: 'io.cozy.contacts.groups' }
      ])
      expect(result.contact).toEqual(2)
      expect(result.group).toEqual(1)
    })

    it('should return 0 if there are no new recipients', () => {
      const result = countNewRecipients(currentRecipients, [])
      expect(result.contact).toEqual(0)
      expect(result.group).toEqual(0)
    })
  })

  describe('getErrorMessage', () => {
    const t = key => key // Mock translation function
    const documentType = 'document'
    const recipients = [{ name: 'John Doe' }]
    const selectedOption = 'readOnly'

    it('should return generic error message for non-FetchError', () => {
      const err = new Error('Some error')
      const result = getErrorMessage({
        t,
        err,
        documentType,
        recipients,
        selectedOption
      })
      expect(result).toEqual([`${documentType}.share.error.generic`])
    })

    it('should return specific error message for FetchError with status 400 and specific detail', () => {
      const err = {
        name: 'FetchError',
        status: 400,
        message: JSON.stringify({
          errors: [
            { detail: 'A group member cannot be added as they are already in' }
          ]
        })
      }
      const result = getErrorMessage({
        t,
        err,
        documentType,
        recipients,
        selectedOption
      })
      expect(result).toEqual([
        'Share.errors.groupMemberAlreadyInSharing',
        {
          smart_count: recipients.length,
          groupName: recipients[0].name,
          sharingRights: 'Share.errors.sharingRights.readWrite',
          icon: false
        }
      ])
    })

    it('should return opposite sharingRights for the other group when the group member already in sharing', () => {
      const err = {
        name: 'FetchError',
        status: 400,
        message: JSON.stringify({
          errors: [
            { detail: 'A group member cannot be added as they are already in' }
          ]
        })
      }
      const result = getErrorMessage({
        t,
        err,
        documentType,
        recipients,
        selectedOption: 'readWrite'
      })
      expect(result).toEqual([
        'Share.errors.groupMemberAlreadyInSharing',
        {
          smart_count: recipients.length,
          groupName: recipients[0].name,
          sharingRights: 'Share.errors.sharingRights.readOnly',
          icon: false
        }
      ])
    })

    it('should return generic error message for FetchError with status 400 and different detail', () => {
      const err = {
        name: 'FetchError',
        status: 400,
        message: JSON.stringify({
          errors: [{ detail: 'Some other detail' }]
        })
      }
      const result = getErrorMessage({
        t,
        err,
        documentType,
        recipients,
        selectedOption
      })
      expect(result).toEqual([`${documentType}.share.error.generic`])
    })
  })
})
