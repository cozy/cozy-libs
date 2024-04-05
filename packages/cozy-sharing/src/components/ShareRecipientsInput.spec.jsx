import { render, screen } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'
import flag from 'cozy-flags'

import ShareRecipientsInput from './ShareRecipientsInput'
import AppLike from './SharingBanner/test/AppLike'

jest.mock('cozy-flags', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('./ShareAutosuggest', () => ({
  __esModule: true,
  default: ({ contactsAndGroups }) => {
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
  const setup = ({ contacts, contactGroups, unreachableContact }) => {
    const mockClient = createMockClient({
      queries: {
        'io.cozy.contacts/reachable': {
          doctype: 'io.cozy.contacts',
          data: contacts
        },
        'io.cozy.contacts.groups/by-ids/fe86af20-c6c5': {
          doctype: 'io.cozy.contacts.groups',
          data: contactGroups
        },
        'io.cozy.contacts/unreachable-with-groups': {
          doctype: 'io.cozy.contacts',
          data: unreachableContact
        }
      }
    })
    render(
      <AppLike client={mockClient}>
        <ShareRecipientsInput
          onPick={() => {}}
          onRemove={() => {}}
          placeholder="Enter recipients here"
        />
      </AppLike>
    )
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

  it('should include unreachable members when flag sharing.show-recipient-groups is activated', async () => {
    flag.mockReturnValue(true)

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
})
