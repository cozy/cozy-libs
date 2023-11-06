import { renderHook } from '@testing-library/react-hooks'
import React from 'react'

import { CozyProvider, createMockClient } from 'cozy-client'

import useMaintenanceStatus from './useMaintenanceStatus'

describe('useMaintenanceStatus', () => {
  const setup = (slug = 'test') => {
    const mockClient = createMockClient({
      queries: {
        'io.cozy.apps_registry/test': {
          doctype: 'io.cozy.apps_registry',
          definition: {
            doctype: 'io.cozy.apps_registry',
            id: 'io.cozy.apps_registry/test'
          },
          data: [
            {
              id: 'test',
              slug: 'test',
              maintenance_activated: true,
              maintenance_options: {
                messages: {
                  en: 'Maintenance in progress'
                }
              }
            }
          ]
        },
        'io.cozy.apps_registry/not-found': {
          doctype: 'io.cozy.apps_registry',
          queryError: new Error('Failed to found konnector')
        }
      }
    })
    const wrapper = ({ children }) => (
      <CozyProvider client={mockClient}>{children}</CozyProvider>
    )
    return renderHook(() => useMaintenanceStatus(slug), { wrapper })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return maintenance status of registry konnector', async () => {
    const { result } = setup()

    expect(result.current.fetchStatus).toBe('loaded')
    expect(result.current.data.isInMaintenance).toBe(true)
    expect(result.current.data.messages).toEqual({
      en: 'Maintenance in progress'
    })
    expect(result.current.lastError).toBe(null)
  })

  it('should not be consider under maintenance if the slug is not found', async () => {
    const { result } = setup('not-found')

    expect(result.current.fetchStatus).toBe('failed')
    expect(result.current.data.isInMaintenance).toBe(false)
    expect(result.current.data.messages).toEqual({})
    expect(result.current.lastError).toEqual(
      new Error('Failed to found konnector')
    )
  })
})
