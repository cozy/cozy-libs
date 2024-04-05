import { render, screen } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import ShareRecipientsInput from './ShareRecipientsInput'
import AppLike from './SharingBanner/test/AppLike'

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
            return <li key={contactOrGroup.id}>{contactOrGroup.name}</li>
          }
        })}
      </ul>
    )
  }
}))

describe('ShareRecipientsInput component', () => {
  const setup = ({ contacts, contactGroups }) => {
    const mockClient = createMockClient({
      queries: {
        'io.cozy.contacts': {
          doctype: 'io.cozy.contacts',
          data: contacts,
          meta: { count: 4 }
        },
        'io.cozy.contacts.groups': {
          doctype: 'io.cozy.contacts.groups',
          data: contactGroups,
          hasMore: false
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
    expect(screen.getByText("The Night's Watch")).toBeInTheDocument()
  })

  it('should include groups only if they have more than one member', async () => {
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
    expect(screen.queryByText("The Night's Watch")).toBeNull()
  })
})
