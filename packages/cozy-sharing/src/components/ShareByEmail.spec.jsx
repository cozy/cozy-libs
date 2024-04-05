import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import React from 'react'
import { act } from 'react-dom/test-utils'

import flag from 'cozy-flags'

import { ShareByEmail } from './ShareByEmail'
import AppLike from '../../test/AppLike'

jest.mock('../helpers/contacts', () => ({
  getOrCreateFromArray: (client, recipients) => recipients
}))

jest.mock('cozy-flags')

describe('ShareByEmailComponent', () => {
  const defaultDocument = {
    id: 'doc_id',
    name: 'documentName'
  }

  const onShare = jest.fn()

  const setup = ({
    sharingDesc = 'test',
    document = defaultDocument,
    currentRecipients = []
  } = {}) => {
    const props = {
      documentType: 'Files',
      onShare,
      document,
      sharingDesc,
      currentRecipients,
      createContact: jest.fn()
    }
    return render(
      <AppLike>
        <ShareByEmail {...props} />
      </AppLike>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shoud call share if submited', async () => {
    const sharingDesc = 'test'

    setup({ sharingDesc })

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Add contacts or groups'), {
        target: { value: 'quentin@cozycloud.cc' }
      })
    })

    act(() => {
      fireEvent.keyPress(
        screen.getByPlaceholderText('Add contacts or groups'),
        {
          key: 'Enter',
          code: 'Enter',
          charCode: 13
        }
      )
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    })

    await waitFor(() => {
      expect(onShare).toHaveBeenCalledWith({
        description: sharingDesc,
        document: defaultDocument,
        openSharing: true,
        readOnlyRecipients: [],
        recipients: [{ email: 'quentin@cozycloud.cc' }]
      })
    })
  })

  it('should alert user when it has reached the recipients limit for a document', async () => {
    flag.mockReturnValue(2)

    setup({
      currentRecipients: [
        {
          email: 'alice@gmail.com',
          status: 'pending',
          type: 'two-way'
        },
        {
          email: 'bob@gmail.com',
          status: 'pending',
          type: 'two-way'
        }
      ]
    })

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Add contacts or groups'), {
        target: { value: 'john@gmail.com' }
      })
    })

    act(() => {
      fireEvent.keyPress(
        screen.getByPlaceholderText('Add contacts or groups'),
        {
          key: 'Enter',
          code: 'Enter',
          charCode: 13
        }
      )
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'I understand' }))
    })

    await waitFor(() => {
      expect(onShare).not.toBeCalled()
    })
  })
})
