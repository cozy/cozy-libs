import { render, screen } from '@testing-library/react'
import React from 'react'

import { ContactSuggestion } from './ContactSuggestion'
import AppLike from '../../test/AppLike'

describe('ContactSuggestion component', () => {
  const setup = ({ contactOrGroup }) => {
    return render(<ContactSuggestion contactOrGroup={contactOrGroup} />, {
      wrapper: AppLike
    })
  }

  it('should display contact suggestion for a contact', () => {
    const jonSnow = {
      _id: 'f3a4e501-abbd',
      fullname: 'Jon Snow',
      name: {
        givenName: 'Jon',
        familyName: 'Snow'
      },
      cozy: [
        {
          primary: true,
          url: 'https://jonsnow.mycozy.cloud'
        }
      ],
      email: [
        {
          address: 'jon.snow@email.com',
          type: 'primary'
        }
      ],
      _type: 'io.cozy.contacts'
    }
    setup({ contactOrGroup: jonSnow })
    expect(screen.getByText('Jon Snow')).toBeInTheDocument()
    expect(screen.getByText('https://jonsnow.mycozy.cloud')).toBeInTheDocument()
  })

  it('should display contact suggestion for a contact without fullname (for example created by a share modal)', () => {
    const jonSnow = {
      _id: 'f3a4e501-abbd',
      cozy: [],
      email: [
        {
          address: 'jon.snow@email.com',
          type: 'primary'
        }
      ],
      name: undefined,
      _type: 'io.cozy.contacts'
    }
    setup({ contactOrGroup: jonSnow })
    expect(screen.getByText('jon.snow@email.com')).toBeInTheDocument()
  })

  it('should display contact suggestion for a group', () => {
    const theNightsWatch = {
      _id: '610718e6-2d7a',
      name: "The Night's Watch",
      _type: 'io.cozy.contacts.groups',
      members: [
        {
          _id: 'f3a4e501-abbd',
          fullname: 'Jon Snow'
        },
        {
          _id: 'ab23a451-tzas',
          fullname: 'Samwell Tarly'
        }
      ]
    }
    setup({ contactOrGroup: theNightsWatch })
    expect(screen.getByText("The Night's Watch")).toBeInTheDocument()
    expect(screen.getByText('2 members')).toBeInTheDocument()
  })
})
