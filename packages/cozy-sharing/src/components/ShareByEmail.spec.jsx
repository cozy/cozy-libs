import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { ShareByEmail } from './ShareByEmail'
import AppLike from '../../test/AppLike'
import { act } from 'react-dom/test-utils'

jest.mock('../helpers/contacts', () => ({
  getOrCreateFromArray: (client, recipients) => recipients
}))

describe('ShareByEmailComponent', () => {
  it('shoud call share if submited', async () => {
    const onShare = jest.fn()
    const props = {
      contacts: {
        data: []
      },
      groups: { data: [] },
      documentType: 'Files',
      onShare: onShare,
      document: {
        id: 'doc_id'
      },
      sharingDesc: 'test',
      createContact: jest.fn()
    }
    const root = render(
      <AppLike>
        <ShareByEmail {...props} />
      </AppLike>
    )

    act(() => {
      fireEvent.change(
        root.getByPlaceholderText(
          'Enter the email address or name of the recipient'
        ),
        { target: { value: 'quentin@cozycloud.cc' } }
      )
    })

    act(() => {
      fireEvent.keyPress(
        root.getByPlaceholderText(
          'Enter the email address or name of the recipient'
        ),
        { key: 'Enter', code: 'Enter', charCode: 13 }
      )
    })

    act(() => {
      fireEvent.click(root.getByRole('button', { name: 'Send' }))
    })

    await waitFor(() => {
      expect(onShare).toHaveBeenCalledWith({
        description: props.sharingDesc,
        document: props.document,
        openSharing: true,
        readOnlyRecipients: [],
        recipients: [{ email: 'quentin@cozycloud.cc' }]
      })
    })
  })
})
