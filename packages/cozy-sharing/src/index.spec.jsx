import React from 'react'
import { mount } from 'enzyme'
import { createMockClient } from 'cozy-client'

import { RefreshableSharings, SharingProvider } from './'
import AppLike from '../test/AppLike'

const DumbComponent = () => {
  return <div>test </div>
}
describe('RefreshableSharings', () => {
  it('should test', () => {
    const client = createMockClient({})

    const component = mount(
      <AppLike client={client}>
        <SharingProvider client={client}>
          <RefreshableSharings>
            {({ refresh }) => (
              <DumbComponent
                client={client}
                t={x => x}
                refreshSharings={refresh}
              />
            )}
          </RefreshableSharings>
        </SharingProvider>
      </AppLike>
    )
    const refreshMethod = component.find(DumbComponent).prop('refreshSharings')

    expect(typeof refreshMethod).toBe('function')
  })
})
