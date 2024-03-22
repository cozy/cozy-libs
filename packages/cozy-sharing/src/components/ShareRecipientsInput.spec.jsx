import { render, screen } from '@testing-library/react'
import React from 'react'

import ShareRecipientsInput from './ShareRecipientsInput'

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
    render(
      <ShareRecipientsInput
        contacts={contacts}
        contactGroups={contactGroups}
        onPick={() => {}}
        onRemove={() => {}}
        placeholder="Enter recipients here"
      />
    )
  }

  it('should include groups and contacts when are loaded', async () => {
    const contacts = {
      id: 'contacts',
      fetchStatus: 'loaded',
      hasMore: false,
      data: [
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
    }
    const contactGroups = {
      id: 'groups',
      fetchStatus: 'loaded',
      hasMore: false,
      data: [
        {
          id: 'fe86af20-c6c5',
          name: "The Night's Watch",
          _id: 'fe86af20-c6c5',
          _type: 'io.cozy.contacts.groups'
        }
      ]
    }

    setup({ contacts, contactGroups })

    expect(screen.getByText('Michale Russel')).toBeInTheDocument()
    expect(screen.getByText('Teagan Wolf')).toBeInTheDocument()
    expect(screen.getByText("The Night's Watch")).toBeInTheDocument()
  })

  it('should include groups only if all contacts are loaded', async () => {
    const contacts = {
      id: 'contacts',
      fetchStatus: 'loading',
      hasMore: false,
      data: [
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
    }
    const contactGroups = {
      id: 'groups',
      fetchStatus: 'loaded',
      hasMore: false,
      data: [
        {
          id: 'fe86af20-c6c5',
          name: "The Night's Watch",
          _id: 'fe86af20-c6c5',
          _type: 'io.cozy.contacts.groups'
        }
      ]
    }

    setup({ contacts, contactGroups })

    expect(screen.getByText('Michale Russel')).toBeInTheDocument()
    expect(screen.getByText('Teagan Wolf')).toBeInTheDocument()
    expect(screen.queryByText("The Night's Watch")).toBeNull()
  })

  it('should include groups only if they have more than one member', async () => {
    const contacts = {
      id: 'contacts',
      fetchStatus: 'loaded',
      hasMore: false,
      data: [
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
    }
    const contactGroups = {
      id: 'groups',
      fetchStatus: 'loaded',
      hasMore: false,
      data: [
        {
          id: 'fe86af20-c6c5',
          name: "The Night's Watch",
          _id: 'fe86af20-c6c5',
          _type: 'io.cozy.contacts.groups'
        }
      ]
    }

    setup({ contacts, contactGroups })

    expect(screen.getByText('Michale Russel')).toBeInTheDocument()
    expect(screen.getByText('Teagan Wolf')).toBeInTheDocument()
    expect(screen.queryByText("The Night's Watch")).toBeNull()
  })
})
