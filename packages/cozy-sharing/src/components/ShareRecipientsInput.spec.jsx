import { shallow } from 'enzyme'
import React from 'react'

import ShareRecipientsInput from './ShareRecipientsInput'

describe('ShareRecipientsInput component', () => {
  it('should match snapshot', () => {
    const props = {
      client: '',
      label: 'Recipients',
      contacts: {
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
      },
      contactGroups: {
        id: 'groups',
        fetchStatus: 'loaded',
        hasMore: false,
        data: [
          {
            id: 'fe86af20-c6c5',
            name: "The Night's Watch",
            _id: 'fe86af20-c6c5',
            _type: 'io.cozy.contacts.groups'
          },
          {
            id: '3d8193ab-2ce4',
            name: 'The North',
            _id: '3d8193ab-2ce4',
            _type: 'io.cozy.contacts.groups'
          }
        ]
      },
      recipients: [
        {
          id: '5a3b4ccf-c257',
          name: {
            givenName: 'Teagan',
            familyName: 'Wolf'
          }
        }
      ],
      onPick: jest.fn().mockName('onPick'),
      onRemove: jest.fn().mockName('onRemove'),
      placeholder: 'Enter recipients here'
    }
    const jsx = <ShareRecipientsInput {...props} />
    const wrapper = shallow(jsx)
    expect(wrapper).toMatchSnapshot()
  })

  it('should include groups only if all contacts are loaded', () => {
    const props = {
      client: '',
      label: 'Recipients',
      contacts: {
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
            }
          }
        ]
      },
      contactGroups: {
        id: 'groups',
        fetchStatus: 'loaded',
        hasMore: false,
        data: [
          {
            id: 'fe86af20-c6c5',
            name: "The Night's Watch",
            _id: 'fe86af20-c6c5',
            _type: 'io.cozy.contacts.groups'
          },
          {
            id: '3d8193ab-2ce4',
            name: 'The North',
            _id: '3d8193ab-2ce4',
            _type: 'io.cozy.contacts.groups'
          }
        ]
      },
      recipients: [
        {
          id: '5a3b4ccf-c257',
          name: {
            givenName: 'Teagan',
            familyName: 'Wolf'
          }
        }
      ],
      onPick: jest.fn().mockName('onPick'),
      onRemove: jest.fn().mockName('onRemove'),
      placeholder: 'Enter recipients here'
    }
    const jsx = <ShareRecipientsInput {...props} />
    const wrapper = shallow(jsx)
    expect(wrapper).toMatchSnapshot()
  })
})
