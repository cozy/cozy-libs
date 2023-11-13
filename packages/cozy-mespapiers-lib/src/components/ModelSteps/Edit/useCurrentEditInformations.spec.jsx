import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { useLocation } from 'react-router-dom'

import { useQuery, isQueryLoading } from 'cozy-client'
import I18n from 'cozy-ui/transpiled/react/providers/I18n'

import { useCurrentEditInformations } from './useCurrentEditInformations'
import enLocale from '../../../locales/en.json'
import { PapersDefinitionsProvider } from '../../Contexts/PapersDefinitionsProvider'
import { ScannerI18nProvider } from '../../Contexts/ScannerI18nProvider'

jest.mock('cozy-client/dist/utils', () => ({
  ...jest.requireActual('cozy-client/dist/utils'),
  isQueryLoading: jest.fn()
}))
jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}))

const setup = ({ mockedData, searchParams = '', currentEditModel } = {}) => {
  const { queryDataResult = {}, isLoadingQuery = false } = mockedData || {}
  useQuery.mockReturnValue({
    data: queryDataResult,
    hasMore: isLoadingQuery
  })
  isQueryLoading.mockReturnValue(isLoadingQuery)
  useLocation.mockImplementation(() => {
    return { search: searchParams }
  })
  const wrapper = ({ children }) => (
    <I18n dictRequire={() => enLocale} lang="en">
      <ScannerI18nProvider lang="en">
        <PapersDefinitionsProvider>{children}</PapersDefinitionsProvider>
      </ScannerI18nProvider>
    </I18n>
  )

  return renderHook(
    () => useCurrentEditInformations('fileId', currentEditModel),
    {
      wrapper
    }
  )
}

describe('useCurrentEditInformations', () => {
  it('should return isLoading to true when the query is in progress', () => {
    const searchParams = 'metadata=issueDate'
    const isLoadingQuery = true

    const { result } = setup({
      mockedData: { isLoadingQuery },
      searchParams,
      currentEditModel: 'information'
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.paperDef).toBe(null)
    expect(result.current.currentStep).toBe(null)
    expect(result.current.searchParams).toEqual({
      metadataName: 'issueDate'
    })
  })

  it('should return correct data', () => {
    const queryDataResult = { metadata: { qualification: { label: 'caf' } } }
    const searchParams = 'metadata=issueDate'
    const isLoadingQuery = false

    const { result } = setup({
      mockedData: { queryDataResult, isLoadingQuery },
      searchParams,
      currentEditModel: 'information'
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.paperDef).toHaveProperty('label', 'caf')
    expect(result.current.currentStep).toHaveProperty('model', 'information')
    expect(result.current.currentStep).toHaveProperty('attributes')
    expect(result.current.currentStep.attributes).toHaveLength(1)
    expect(result.current.currentStep.attributes[0].name).toBe('issueDate')
    expect(result.current.searchParams).toEqual({
      metadataName: 'issueDate'
    })
  })

  it('should return currentStep to "null" if has no metadata searchParams', () => {
    const queryDataResult = { metadata: { qualification: { label: 'caf' } } }
    const searchParams = ''
    const isLoadingQuery = false

    const { result } = setup({
      mockedData: { queryDataResult, isLoadingQuery },
      searchParams,
      currentEditModel: 'information'
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.paperDef).toHaveProperty('label', 'caf')
    expect(result.current.currentStep).toBe(null)
    expect(result.current.searchParams).toEqual({
      metadataName: null
    })
  })

  it('should return "paperDef" & "currentStep" to "null" if there is no match in the paperDefinitions file', () => {
    const queryDataResult = { metadata: { qualification: { label: 'other' } } }

    const searchParams = 'metadata=issueDate'
    const isLoadingQuery = false

    const { result } = setup({
      mockedData: { queryDataResult, isLoadingQuery },
      searchParams,
      currentEditModel: 'information'
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.paperDef).toBe(null)
    expect(result.current.currentStep).toBe(null)
    expect(result.current.searchParams).toEqual({
      metadataName: 'issueDate'
    })
  })
})
