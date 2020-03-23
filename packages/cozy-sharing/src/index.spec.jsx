import React from 'react'
import { mount } from 'enzyme'
import { createMockClient } from 'cozy-client'

import SharingContext from './context'
import { RefreshableSharings, SharingProvider } from './'
import AppLike from '../test/AppLike'

import { receiveSharings } from './state'

const DumbComponent = () => {
  return <div>test </div>
}

const AppWrapper = ({ children, client }) => {
  return (
    <AppLike client={client}>
      <SharingProvider client={client}>{children}</SharingProvider>
    </AppLike>
  )
}

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

describe('RefreshableSharings', () => {
  it('should test', () => {
    const client = createMockClient({})

    const component = mount(
      <AppWrapper client={client}>
        <RefreshableSharings>
          {({ refresh }) => (
            <DumbComponent
              client={client}
              t={x => x}
              refreshSharings={refresh}
            />
          )}
        </RefreshableSharings>
      </AppWrapper>
    )
    const refreshMethod = component.find(DumbComponent).prop('refreshSharings')

    expect(typeof refreshMethod).toBe('function')
  })
})
