import React, { useState } from 'react'

import ShareAutosuggest from './ShareAutosuggest'

const meta = {
  component: ShareAutosuggest,
  args: {}
}

export default meta

const ShareAutosuggestRender = props => {
  const [recipients, setRecipients] = useState([])
  const onPick = contactOrGroup => {
    setRecipients([...recipients, contactOrGroup])
  }

  const onRemove = contactOrGroup => {
    setRecipients(recipients.filter(r => r.id !== contactOrGroup.id))
  }
  return (
    <ShareAutosuggest
      {...props}
      recipients={recipients}
      onPick={onPick}
      onRemove={onRemove}
    />
  )
}

export const Default = {
  name: 'Default',
  render: ShareAutosuggestRender,
  args: {
    loading: false,
    contactsAndGroups: [
      {
        id: 'group1',
        name: 'Family',
        _type: 'io.cozy.contacts.groups',
        members: [
          {
            id: 'contact1',
            name: 'John Doe',
            _type: 'io.cozy.contacts'
          },
          {
            id: 'contact2',
            name: 'Jane Doe',
            _type: 'io.cozy.contacts'
          }
        ]
      },
      {
        id: 'contact3',
        name: 'Alice Wonderland',
        _type: 'io.cozy.contacts',
        email: 'alice@wonder.land'
      }
    ],
    placeholder: 'Type a name or email address'
  }
}
