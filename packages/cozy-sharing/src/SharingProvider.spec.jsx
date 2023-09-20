import { act, render, screen } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'

import { createMockClient } from 'cozy-client'

import { SharingProvider } from './SharingProvider'
import SharingContext from './context'
import { receiveSharings } from './state'
import AppLike from '../test/AppLike'

const AppWrapper = ({ children, client }) => {
  return (
    <AppLike client={client}>
      <SharingProvider client={client}>{children}</SharingProvider>
    </AppLike>
  )
}

describe('allLoaded', () => {
  const client = createMockClient({})
  client.isLogged = true
  client.collection = () => ({
    findByDoctype: jest.fn().mockResolvedValue({
      data: []
    }),
    findLinksByDoctype: jest.fn().mockResolvedValue({
      data: []
    }),
    findApps: jest.fn().mockResolvedValue({
      data: []
    })
  })

  it('Change to True when all data is loaded', async () => {
    render(
      <AppWrapper client={client}>
        <SharingContext.Consumer>
          {({ allLoaded }) => <div>{`allLoaded: ${allLoaded}`}</div>}
        </SharingContext.Consumer>
      </AppWrapper>
    )

    expect(screen.getByText('allLoaded: false')).toBeInTheDocument()

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(screen.getByText('allLoaded: true')).toBeInTheDocument()
  })
})

describe('SharingProvider', () => {
  const client = createMockClient({})

  client.plugins.realtime = {
    subscribe: jest.fn(),
    unsubscribe: jest.fn()
  }

  client.isLogged = true

  beforeEach(() => {
    jest.spyOn(client, 'collection')
    jest
      .spyOn(SharingProvider.prototype, 'fetchAllSharings')
      .mockReturnValue(Promise.resolve())
  })
  afterEach(() => jest.resetAllMocks())

  it('loads data on mount', () => {
    mount(<AppWrapper client={client} />)

    expect(client.plugins.realtime.subscribe).toHaveBeenCalled()
    expect(SharingProvider.prototype.fetchAllSharings).toHaveBeenCalled()
  })

  it('loads nothing when the client is not logged in', () => {
    client.isLogged = false
    mount(<AppWrapper client={client} />)

    expect(client.plugins.realtime.subscribe).not.toHaveBeenCalled()
    expect(SharingProvider.prototype.fetchAllSharings).not.toHaveBeenCalled()

    client.emit('plugin:realtime:login')
    expect(client.plugins.realtime.subscribe).toHaveBeenCalled()
    expect(SharingProvider.prototype.fetchAllSharings).toHaveBeenCalled()
  })
})

describe('hasWriteAccess', () => {
  it('tells if a doc is writtable', () => {
    const client = createMockClient({})
    client.stackClient.uri = 'http://cozy.tools:8080'

    const component = mount(
      <AppWrapper client={client}>
        <SharingContext.Consumer>
          {({ hasWriteAccess }) => (
            <>
              <div data-id="no-sharing">
                {hasWriteAccess('no-sharing') ? 'yes' : 'no'}
              </div>
              <div data-id="owner-doc">
                {hasWriteAccess('owner-doc') ? 'yes' : 'no'}
              </div>
              <div data-id="synced-doc">
                {hasWriteAccess('synced-doc') ? 'yes' : 'no'}
              </div>
              <div data-id="read-only-doc">
                {hasWriteAccess('read-only-doc') ? 'yes' : 'no'}
              </div>
            </>
          )}
        </SharingContext.Consumer>
      </AppWrapper>
    )

    expect(component.find('div[data-id="no-sharing"]').text()).toBe('yes')
    expect(component.find('div[data-id="owner-doc"]').text()).toBe('yes')
    expect(component.find('div[data-id="synced-doc"]').text()).toBe('yes')
    expect(component.find('div[data-id="read-only-doc"]').text()).toBe('yes')

    const provider = component.find(SharingProvider)
    provider.instance().dispatch(
      receiveSharings({
        sharings: [
          {
            id: '123',
            type: 'io.cozy.sharings',
            attributes: {
              owner: true,
              members: [
                { read_only: false, instance: 'http://cozy.tools:8080' }
              ],
              rules: [{ values: ['owner-doc'] }]
            }
          },
          {
            id: '456',
            type: 'io.cozy.sharings',
            attributes: {
              owner: false,
              members: [
                { read_only: false, instance: 'http://cozy.tools:8080' }
              ],
              rules: [
                { values: ['synced-doc'], update: 'sync', remove: 'sync' }
              ]
            }
          },
          {
            id: '789',
            type: 'io.cozy.sharings',
            attributes: {
              owner: false,
              members: [
                { read_only: true, instance: 'http://cozy.tools:8080' }
              ],
              rules: [{ values: ['read-only-doc'] }]
            }
          }
        ]
      })
    )

    component.update()

    expect(component.find('div[data-id="no-sharing"]').text()).toBe('yes')
    expect(component.find('div[data-id="owner-doc"]').text()).toBe('yes')
    expect(component.find('div[data-id="synced-doc"]').text()).toBe('yes')
    expect(component.find('div[data-id="read-only-doc"]').text()).toBe('no')
  })
})
