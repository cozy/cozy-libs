import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'

import { createMockClient } from 'cozy-client'

import { useSharingInfos } from './useSharingInfos'
import AppLike from '../test/AppLike'

describe('useSharingInfos', () => {
  const { location } = window

  const mockClient = createMockClient({})
  const fetchOwnPermissionsMock = jest.fn()
  const getDiscoveryLinkMock = jest.fn()
  const queryMock = jest.fn()
  mockClient.collection = () => ({
    fetchOwnPermissions: fetchOwnPermissionsMock,
    getDiscoveryLink: getDiscoveryLinkMock
  })
  mockClient.query = queryMock
  const setup = () => {
    const wrapper = ({ children }) => (
      <AppLike client={mockClient}>{children}</AppLike>
    )

    return renderHook(() => useSharingInfos(), {
      wrapper
    })
  }

  const mockSharing = { data: {} }
  const mockedPermissionsWithInstance = {
    data: {
      type: 'io.cozy.permissions',
      id: 'bf716babb70b73b89c870fccce00233f',
      attributes: {
        source_id: 'io.cozy.sharings/bf716babb70b73b89c870fccce00233a'
      }
    },
    included: [
      {
        type: 'io.cozy.sharings.members',
        attributes: {
          status: 'seen',
          name: 'Bob',
          email: 'bob@cozy.tools',
          instance: 'http://b.cozy.tools'
        }
      }
    ]
  }

  const mockedPermissionsWithoutInstance = {
    data: {
      type: 'io.cozy.permissions',
      id: 'bf716babb70b73b89c870fccce00233f',
      attributes: {
        source_id: 'io.cozy.sharings/bf716babb70b73b89c870fccce00233a'
      }
    },
    included: [
      {
        type: 'io.cozy.sharings.members',
        attributes: {
          status: 'seen',
          name: 'Bob',
          email: 'bob@cozy.tools'
        }
      }
    ]
  }
  beforeAll(() => {
    delete window.location
    window.location = {
      pathname: '/preview',
      search: '?sharecode=5FAZbBB4Iy0k'
    }
  })
  afterAll(() => {
    window.location = location
  })

  it('returns the right infos when using useSharingInfo', async () => {
    const addSharingLink = '/addSharingLink'
    getDiscoveryLinkMock.mockReturnValue(addSharingLink)
    fetchOwnPermissionsMock.mockResolvedValue(mockedPermissionsWithInstance)
    queryMock.mockResolvedValue(mockSharing)
    const { result, waitForNextUpdate } = setup()
    // default state
    expect(result.current.loading).toEqual(true)

    await act(() => waitForNextUpdate())
    expect(result.current.loading).toEqual(false)
    expect(result.current.isSharingShortcutCreated).toEqual(true)
    expect(result.current.sharing).toEqual(mockSharing.data)
    expect(result.current.addSharingLink).toEqual(addSharingLink)
  })

  it('returns the right infos when using useSharingInfo without addSharingLink', async () => {
    const addSharingLink = undefined
    getDiscoveryLinkMock.mockReturnValue(addSharingLink)
    fetchOwnPermissionsMock.mockResolvedValue(mockedPermissionsWithoutInstance)
    queryMock.mockResolvedValue(mockSharing)
    const { result, waitForNextUpdate } = setup()
    // default state
    expect(result.current.loading).toEqual(true)

    await act(() => waitForNextUpdate())
    expect(result.current.loading).toEqual(false)
    expect(result.current.isSharingShortcutCreated).toEqual(false)
    expect(result.current.sharing).toEqual(mockSharing.data)
    expect(result.current.addSharingLink).toEqual(addSharingLink)
  })

  it('returns loading false if there is nothing to do aka sharing by link', () => {
    delete window.location
    window.location = {
      pathname: '/public',
      search: '?sharecode=5FAZbBB4Iy0k'
    }
    const { result } = setup()
    expect(result.current.loading).toEqual(false)
  })
})
