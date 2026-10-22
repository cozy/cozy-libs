import { render, screen } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'
import flag from 'cozy-flags'

import ShareRecipientsInput from './ShareRecipientsInput'
import AppLike from './SharingBanner/test/AppLike'

jest.mock('cozy-flags', () => ({
  __esModule: true,
  default: jest.fn(() => null)
}))

let mockAutosuggestProps
jest.mock('./ShareAutosuggest', () => ({
  __esModule: true,
  default: props => {
    mockAutosuggestProps = props
    const { contactsAndGroups } = props
    return (
      <ul>
        {contactsAndGroups.map(contactOrGroup => {
          if (contactOrGroup._type === 'io.cozy.contacts') {
            return (
              <li key={contactOrGroup.id}>
                {contactOrGroup.name.givenName} {contactOrGroup.name.familyName}
              </li>
            )
          } else {
            return (
              <li key={contactOrGroup.id}>
                {contactOrGroup.name} - {contactOrGroup.members.length} members
              </li>
            )
          }
        })}
      </ul>
    )
  }
}))

describe('ShareRecipientsInput component', () => {
  const setup = (
    { contacts, contactGroups, unreachableContact, groupMembers },
    { currentRecipients, recipients } = {}
  ) => {
    const mockClient = createMockClient({
      queries: {
        'io.cozy.contacts/reachable': {
          doctype: 'io.cozy.contacts',
          data: contacts
        },
        'io.cozy.contacts.groups': {
          doctype: 'io.cozy.contacts.groups',
          data: contactGroups
        },
        'io.cozy.contacts/unreachable-with-groups': {
          doctype: 'io.cozy.contacts',
          data: unreachableContact
        },
        'io.cozy.contacts/reachable-with-groups': {
          doctype: 'io.cozy.contacts',
          data: groupMembers
        }
      }
    })
    render(
      <AppLike client={mockClient}>
        <ShareRecipientsInput
          onPick={() => {}}
          onRemove={() => {}}
          placeholder="Enter recipients here"
          currentRecipients={currentRecipients}
          recipients={recipients}
        />
      </AppLike>
    )
    return mockClient
  }

  it('should include groups and contacts when are loaded', async () => {
    const contacts = [
      {
        id: 'df563cc4-6440',
        _id: 'df563cc4-6440',
        _type: 'io.cozy.contacts',
        name: {
          givenName: 'Michale',
          familyName: 'Russel'
        }
      },
      {
        id: '5a3b4ccf-c257',
        _id: '5a3b4ccf-c257',
        _type: 'io.cozy.contacts',
        name: {
          givenName: 'Teagan',
          familyName: 'Wolf'
        },
        relationships: {
          groups: {
            data: [
              {
                _id: 'fe86af20-c6c5',
                _type: 'io.cozy.contacts.groups'
              }
            ]
          }
        }
      }
    ]

    const contactGroups = [
      {
        id: 'fe86af20-c6c5',
        name: "The Night's Watch",
        _id: 'fe86af20-c6c5',
        _type: 'io.cozy.contacts.groups'
      }
    ]

    setup({ contacts, contactGroups })

    expect(screen.getByText('Michale Russel')).toBeInTheDocument()
    expect(screen.getByText('Teagan Wolf')).toBeInTheDocument()
    expect(
      screen.getByText("The Night's Watch - 1 members")
    ).toBeInTheDocument()
  })

  it('should exclude current user from suggestions when me is true', async () => {
    const contacts = [
      {
        id: 'df563cc4-6440',
        _id: 'df563cc4-6440',
        _type: 'io.cozy.contacts',
        me: true,
        name: {
          givenName: 'My',
          familyName: 'Self'
        },
        relationships: {
          groups: {
            data: [
              {
                _id: 'group-id',
                _type: 'io.cozy.contacts.groups'
              }
            ]
          }
        }
      },
      {
        id: '5a3b4ccf-c257',
        _id: '5a3b4ccf-c257',
        _type: 'io.cozy.contacts',
        name: {
          givenName: 'Teagan',
          familyName: 'Wolf'
        },
        relationships: {
          groups: {
            data: [
              {
                _id: 'group-id',
                _type: 'io.cozy.contacts.groups'
              }
            ]
          }
        }
      }
    ]

    const contactGroups = [
      {
        id: 'group-id',
        name: 'Friends',
        _id: 'group-id',
        _type: 'io.cozy.contacts.groups'
      }
    ]

    setup({ contacts, contactGroups })

    expect(screen.queryByText('My Self')).not.toBeInTheDocument()
    expect(screen.getByText('Teagan Wolf')).toBeInTheDocument()
    expect(screen.getByText('Friends - 1 members')).toBeInTheDocument()
  })

  it('should exclude already added recipients from suggestions', async () => {
    const contacts = [
      {
        id: 'df563cc4-6440',
        _id: 'df563cc4-6440',
        _type: 'io.cozy.contacts',
        name: {
          givenName: 'Michale',
          familyName: 'Russel'
        },
        email: [{ address: 'michale@example.com', primary: true }]
      },
      {
        id: '5a3b4ccf-c257',
        _id: '5a3b4ccf-c257',
        _type: 'io.cozy.contacts',
        name: {
          givenName: 'Teagan',
          familyName: 'Wolf'
        },
        email: [{ address: 'teagan@example.com', primary: true }]
      }
    ]

    const contactGroups = []
    const currentRecipients = [
      { id: 'recipient-1', email: 'michale@example.com' }
    ]
    const recipients = [{ _id: '5a3b4ccf-c257' }]

    setup({ contacts, contactGroups }, { currentRecipients, recipients })

    // Michale is in currentRecipients by email, should be filtered out
    expect(screen.queryByText('Michale Russel')).not.toBeInTheDocument()
    // Teagan is in recipients by _id, should be filtered out
    expect(screen.queryByText('Teagan Wolf')).not.toBeInTheDocument()
  })

  it('should include unreachable members when flag sharing.show-recipient-groups is activated', async () => {
    flag.mockImplementation(name => name === 'sharing.show-recipient-groups')

    const contacts = [
      {
        id: 'df563cc4-6440',
        _id: 'df563cc4-6440',
        _type: 'io.cozy.contacts',
        name: {
          givenName: 'Michale',
          familyName: 'Russel'
        }
      },
      {
        id: '5a3b4ccf-c257',
        _id: '5a3b4ccf-c257',
        _type: 'io.cozy.contacts',
        name: {
          givenName: 'Teagan',
          familyName: 'Wolf'
        },
        relationships: {
          groups: {
            data: [
              {
                _id: 'fe86af20-c6c5',
                _type: 'io.cozy.contacts.groups'
              }
            ]
          }
        }
      }
    ]

    const contactGroups = [
      {
        id: 'fe86af20-c6c5',
        name: "The Night's Watch",
        _id: 'fe86af20-c6c5',
        _type: 'io.cozy.contacts.groups'
      }
    ]

    const unreachableContact = [
      {
        id: 'df532cc4-6560',
        _id: 'df532cc4-6560',
        _type: 'io.cozy.contacts',
        name: {
          givenName: 'Tony',
          familyName: 'Stark'
        },
        relationships: {
          groups: {
            data: [
              {
                _id: 'fe86af20-c6c5',
                _type: 'io.cozy.contacts.groups'
              }
            ]
          }
        }
      }
    ]

    setup({ contacts, contactGroups, unreachableContact })

    expect(screen.getByText('Michale Russel')).toBeInTheDocument()
    expect(screen.getByText('Teagan Wolf')).toBeInTheDocument()
    // 3 members because cozy-client replay the query with the new data
    // so the unreachableContact is added to the reachable contact query
    // TODO: improve createMockClient to handle this case
    expect(
      screen.getByText("The Night's Watch - 3 members")
    ).toBeInTheDocument()
  })

  describe('with sharing.contacts-suggest.enabled', () => {
    beforeEach(() => {
      flag.mockImplementation(
        name => name === 'sharing.contacts-suggest.enabled'
      )
    })

    it('should suggest only groups, with the count of their members', () => {
      const groupMembers = [
        {
          id: '5a3b4ccf-c257',
          _id: '5a3b4ccf-c257',
          _type: 'io.cozy.contacts',
          name: { givenName: 'Teagan', familyName: 'Wolf' },
          relationships: {
            groups: {
              data: [{ _id: 'fe86af20-c6c5', _type: 'io.cozy.contacts.groups' }]
            }
          }
        }
      ]
      const contactGroups = [
        {
          id: 'fe86af20-c6c5',
          _id: 'fe86af20-c6c5',
          _type: 'io.cozy.contacts.groups',
          name: 'Friends'
        }
      ]

      setup({ contactGroups, groupMembers })

      expect(screen.getByText('Friends - 1 members')).toBeInTheDocument()
      expect(screen.queryByText('Teagan Wolf')).not.toBeInTheDocument()
    })

    it('should fetch suggestions without the current and pending recipients', async () => {
      const suggestion = email => ({
        type: 'io.cozy.contacts',
        attributes: { fullname: email, email: [{ address: email }] }
      })
      const mockClient = setup(
        { contactGroups: [], groupMembers: [] },
        {
          currentRecipients: [{ email: 'current@cozy.cc' }],
          recipients: [{ email: 'pending@cozy.cc' }]
        }
      )
      const fetchJSON = jest.fn().mockResolvedValue({
        data: [
          suggestion('current@cozy.cc'),
          suggestion('pending@cozy.cc'),
          suggestion('new@cozy.cc')
        ]
      })
      jest.spyOn(mockClient, 'getStackClient').mockReturnValue({ fetchJSON })

      const contacts = await mockAutosuggestProps.fetchContacts('coz')

      expect(contacts.map(c => c.fullname)).toEqual(['new@cozy.cc'])
    })
  })
})
