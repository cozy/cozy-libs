import { mount } from 'enzyme'
import React from 'react'

import { createMockClient } from 'cozy-client'

import { RefreshableSharings } from './RefreshableSharings'
import { SharingProvider } from './SharingProvider'
import AppLike from '../test/AppLike'

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
