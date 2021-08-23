import React from 'react'
import Recipient, { excludeMeAsOwnerFromRecipients } from './Recipient'
import AppLike from '../../test/AppLike'
import { createMockClient } from 'cozy-client'
import { render, fireEvent } from '@testing-library/react'

describe('Recipient component', () => {
  const client = createMockClient({})
  client.options = {
    uri: 'foo.mycozy.cloud'
  }

  const setup = props => {
    return render(
      <AppLike client={client}>
        <Recipient {...props} />
      </AppLike>
    )
  }

  let createRangeBackup

  beforeAll(() => {
    createRangeBackup = global.document.createRange
    global.document.createRange = jest.fn(() => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document
      }
    }))
  })

  afterAll(() => {
    global.document.createRange = createRangeBackup
  })

  it('should render if isMe ', () => {
    const { getByText } = setup({
      instance: 'foo.mycozy.cloud',
      status: 'ready',
      type: 'two-way'
    })
    expect(getByText('You')).toBeTruthy()
    expect(getByText('foo.mycozy.cloud')).toBeTruthy()
  })

  it('should match snapshot if isOwner', () => {
    const { getByText } = setup({
      instance: 'foo.mycozy.cloud',
      status: 'ready',
      type: 'two-way',
      isOwner: true
    })
    expect(getByText('You')).toBeTruthy()
    expect(getByText('foo.mycozy.cloud')).toBeTruthy()
  })

  it('should call revokeSelf if I am not the owner but try to revoke myself', async () => {
    const onRevoke = jest.fn()
    const onRevokeSelf = jest.fn()

    const { getByText } = setup({
      instance: 'foo.mycozy.cloud',
      status: 'ready',
      type: 'two-way',
      documentType: 'Files',
      onRevoke,
      onRevokeSelf
    })

    fireEvent.click(getByText('Can Change'))
    fireEvent.click(getByText('Remove me from sharing'))
    expect(onRevoke).not.toBeCalled()
    expect(onRevokeSelf).toBeCalled()
  })

  it('should call revoke if I am the owner of the sharing', async () => {
    const onRevoke = jest.fn()
    const onRevokeSelf = jest.fn()

    const { getByText } = setup({
      instance: 'foo.mycozy.cloud',
      status: 'ready',
      type: 'two-way',
      isOwner: true,
      documentType: 'Files',
      onRevoke,
      onRevokeSelf
    })

    fireEvent.click(getByText('Can Change'))
    fireEvent.click(getByText('Remove from sharing'))
    expect(onRevoke).toBeCalled()
    expect(onRevokeSelf).not.toBeCalled()
  })

  it('should render confirmation actions if recipient is waiting for confirmation', () => {
    const confirmRecipient = jest.fn()
    const rejectRecipient = jest.fn()

    const { getByText } = setup({
      instance: 'foo.mycozy.cloud',
      status: 'ready',
      type: 'two-way',
      isOwner: false,
      documentType: 'Organizations',
      recipientConfirmationData: {
        email: 'me@bob.cozy.localhost'
      },
      rejectRecipient,
      confirmRecipient
    })

    expect(getByText('Confirm')).toBeTruthy()
  })

  it('should not render confirmation actions if no recipient is waiting for confirmation', () => {
    const confirmRecipient = jest.fn()
    const rejectRecipient = jest.fn()

    const { queryByText } = setup({
      instance: 'foo.mycozy.cloud',
      status: 'ready',
      type: 'two-way',
      isOwner: false,
      documentType: 'Organizations',
      recipientConfirmationData: undefined,
      rejectRecipient,
      confirmRecipient
    })

    expect(queryByText('Confirm')).not.toBeInTheDocument()
  })

  it(`should call confirmRecipient when clicking 'confirm' button`, () => {
    const confirmRecipient = jest.fn()
    const rejectRecipient = jest.fn()

    const { getByText } = setup({
      instance: 'foo.mycozy.cloud',
      status: 'ready',
      type: 'two-way',
      isOwner: false,
      documentType: 'Organizations',
      recipientConfirmationData: {
        email: 'me@bob.cozy.localhost'
      },
      rejectRecipient,
      confirmRecipient
    })

    fireEvent.click(getByText('Confirm'))

    expect(confirmRecipient).toBeCalledWith({
      email: 'me@bob.cozy.localhost'
    })
    expect(rejectRecipient).not.toBeCalled()
  })

  it(`should call rejectRecipient when clicking 'reject' button`, () => {
    const confirmRecipient = jest.fn()
    const rejectRecipient = jest.fn()

    const { getByLabelText } = setup({
      instance: 'foo.mycozy.cloud',
      status: 'ready',
      type: 'two-way',
      isOwner: false,
      documentType: 'Organizations',
      recipientConfirmationData: {
        email: 'me@bob.cozy.localhost'
      },
      rejectRecipient,
      confirmRecipient
    })

    fireEvent.click(getByLabelText('Reject'))

    expect(rejectRecipient).toBeCalledWith({
      email: 'me@bob.cozy.localhost'
    })
    expect(confirmRecipient).not.toBeCalled()
  })
})

describe('excludeMeAsOwnerFromRecipients', () => {
  test('excludeMeAsOwnerFromRecipients behavior', () => {
    const recipients = [
      {
        status: 'owner',
        instance: 'http://foo1.cozy.bar'
      },
      { status: 'pending', instance: 'http://foo2.cozy.bar' },
      {
        status: 'pending',
        instance: 'http://foo3.cozy.bar'
      }
    ]
    const client = { options: { uri: 'http://foo2.cozy.bar' } }
    expect(
      excludeMeAsOwnerFromRecipients({ recipients, isOwner: true, client })
    ).toEqual([
      { status: 'pending', instance: 'http://foo2.cozy.bar' },
      {
        status: 'pending',
        instance: 'http://foo3.cozy.bar'
      }
    ])
    expect(
      excludeMeAsOwnerFromRecipients({ recipients, isOwner: false, client })
    ).toEqual([
      {
        status: 'owner',
        instance: 'http://foo1.cozy.bar'
      },
      {
        status: 'pending',
        instance: 'http://foo3.cozy.bar'
      }
    ])
  })
})
