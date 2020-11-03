import React from 'react'
import { mount } from 'enzyme'

import { createMockClient } from 'cozy-client'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import AppLike from '../../test/AppLike'
import { default as DumbShareModal } from './ShareModal'
import { SharingProvider } from '../index'
import { receivePaths } from '../state'
import { useFetchDocumentPath } from './useFetchDocumentPath'
import { EditableSharingModal } from './EditableSharingModal'

jest.mock('./useFetchDocumentPath', () => ({
  useFetchDocumentPath: jest.fn()
}))

const AppWrapper = ({ children, client }) => {
  return (
    <AppLike client={client}>
      <BreakpointsProvider>
        <SharingProvider client={client}>{children}</SharingProvider>
      </BreakpointsProvider>
    </AppLike>
  )
}

describe('EditableSharingModal', () => {
  const client = createMockClient({})
  const setup = ({ document }) => {
    const component = mount(
      <AppWrapper client={client}>
        <EditableSharingModal
          client={client}
          contacts={{ data: [] }}
          document={document}
          groups={{ data: [] }}
          t={x => x}
          onClose={() => {}}
        />
      </AppWrapper>
    )
    return { component }
  }

  it('will set to false the shared parent / child if the document has no path', () => {
    const { component } = setup({ document: {} })

    const mod = component.find(DumbShareModal)
    expect(mod.length).toBe(1)
    expect(mod.prop('hasSharedChild')).toBe(undefined)
    expect(mod.prop('hasSharedParent')).toBe(undefined)
  })

  it('will set to true the sharedChild if a child is shared and document has path from the beginning', () => {
    useFetchDocumentPath.mockReturnValue(['/a'])
    const { component } = setup({ document: { path: '/a' } })

    const provider = component.find(SharingProvider)
    provider.instance().dispatch(receivePaths(['/a/b']))

    component.update()

    const mod = component.find(DumbShareModal)
    expect(mod.length).toBe(1)
    expect(mod.prop('hasSharedChild')).toBe(true)
    expect(mod.prop('hasSharedParent')).toBe(false)
  })

  it('will set to true the sharedChild if a child is shared and the document path fetched latter', () => {
    const { component } = setup({ document: {} })
    useFetchDocumentPath.mockReturnValue(['/a'])

    const provider = component.find(SharingProvider)
    provider.instance().dispatch(receivePaths(['/a/b']))

    component.update()

    const mod = component.find(DumbShareModal)
    expect(mod.length).toBe(1)
    expect(mod.prop('hasSharedChild')).toBe(true)
    expect(mod.prop('hasSharedParent')).toBe(false)
  })
})
