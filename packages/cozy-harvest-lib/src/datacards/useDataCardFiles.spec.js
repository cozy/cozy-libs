import { renderHook } from '@testing-library/react-hooks'

import { useDataCardFiles } from './useDataCardFiles'

const mockUseQuery = jest.fn()
const mockFile1 = { cozyMetadata: { createdAt: '1970-01-01T00:00:11Z' } }
const mockFile2 = { cozyMetadata: { createdAt: '1970-01-01T00:00:10Z' } }
const mockFile3 = { cozyMetadata: { createdAt: '1970-01-01T00:00:09Z' } }
const mockFile4 = { cozyMetadata: { createdAt: '1970-01-01T00:00:08Z' } }
const mockFile5 = { cozyMetadata: { createdAt: '1970-01-01T00:00:07Z' } }
const mockFile6 = { cozyMetadata: { createdAt: '1970-01-01T00:00:06Z' } }
const mockFile7 = { cozyMetadata: { createdAt: '1970-01-01T00:00:05Z' } }
const mockFile8 = { cozyMetadata: { createdAt: '1970-01-01T00:00:04Z' } }
const mockFile9 = { cozyMetadata: { createdAt: '1970-01-01T00:00:03Z' } }
const mockFile10 = { cozyMetadata: { createdAt: '1970-01-01T00:00:02Z' } }
const mockFile11 = { cozyMetadata: { createdAt: '1970-01-01T00:00:01Z' } }
const mockFile12 = { cozyMetadata: { createdAt: '1970-01-01T00:00:00Z' } }

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  useQuery: () => mockUseQuery()
}))

afterEach(() => {
  mockUseQuery.mockClear()
})

it('handles files pending', () => {
  mockUseQuery.mockReturnValueOnce({ fetchStatus: 'pending', data: null })
  mockUseQuery.mockReturnValueOnce({ fetchStatus: 'pending', data: null })
  const { result } = renderHook(() => useDataCardFiles('1', '2'))
  expect(result.current).toStrictEqual({ fetchStatus: 'loading' })
})

it('handles files loading', () => {
  mockUseQuery.mockReturnValueOnce({ fetchStatus: 'loading', data: null })
  mockUseQuery.mockReturnValueOnce({ fetchStatus: 'loading', data: null })
  const { result } = renderHook(() => useDataCardFiles('1', '2'))
  expect(result.current).toStrictEqual({ fetchStatus: 'loading' })
})

it('handles files loading with partial data', () => {
  mockUseQuery.mockReturnValueOnce({
    fetchStatus: 'loading',
    data: [mockFile1]
  })
  mockUseQuery.mockReturnValueOnce({
    fetchStatus: 'loading',
    data: [mockFile2]
  })
  const { result } = renderHook(() => useDataCardFiles('1', '2'))
  expect(result.current).toStrictEqual({ fetchStatus: 'loading' })
})

it('handles files loading with more partial data', () => {
  mockUseQuery.mockReturnValueOnce({
    fetchStatus: 'loading',
    data: [mockFile1, mockFile2]
  })
  mockUseQuery.mockReturnValueOnce({
    fetchStatus: 'loading',
    data: [mockFile3, mockFile4]
  })
  const { result } = renderHook(() => useDataCardFiles('1', '2'))
  expect(result.current).toStrictEqual({ fetchStatus: 'loading' })
})

it('handles files loading with empty data', () => {
  mockUseQuery.mockReturnValueOnce({
    fetchStatus: 'loaded',
    data: [],
    lastFetch: 1
  })
  mockUseQuery.mockReturnValueOnce({
    fetchStatus: 'loaded',
    data: [],
    lastFetch: 1
  })
  const { result } = renderHook(() => useDataCardFiles('1', '2'))
  expect(result.current).toStrictEqual({ fetchStatus: 'empty' })
})

it('handles files loaded and return in correct order', () => {
  mockUseQuery.mockReturnValueOnce({
    fetchStatus: 'loaded',
    data: [mockFile2, mockFile1],
    lastFetch: 1
  })
  mockUseQuery.mockReturnValueOnce({
    fetchStatus: 'loaded',
    data: [mockFile3, mockFile4],
    lastFetch: 1
  })
  const { result } = renderHook(() => useDataCardFiles('1', '2'))
  expect(result.current).toStrictEqual({
    data: [mockFile1, mockFile2, mockFile3, mockFile4],
    fetchStatus: 'loaded'
  })
})

it('handles files loaded with identical double return', () => {
  mockUseQuery.mockReturnValueOnce({
    fetchStatus: 'loaded',
    data: [mockFile1, mockFile2, mockFile3, mockFile4],
    lastFetch: 1
  })
  mockUseQuery.mockReturnValueOnce({
    fetchStatus: 'loaded',
    data: [mockFile3, mockFile2, mockFile3, mockFile4],
    lastFetch: 1
  })
  const { result } = renderHook(() => useDataCardFiles('1', '2'))
  expect(result.current).toStrictEqual({
    data: [mockFile1, mockFile2, mockFile3, mockFile4],
    fetchStatus: 'loaded'
  })
})

it('handles files loaded with more than 5 result', () => {
  mockUseQuery.mockReturnValueOnce({
    fetchStatus: 'loaded',
    data: [mockFile1, mockFile2, mockFile3, mockFile4, mockFile5, mockFile6],
    lastFetch: 1
  })
  mockUseQuery.mockReturnValueOnce({
    fetchStatus: 'loaded',
    data: [mockFile7, mockFile8, mockFile9, mockFile10, mockFile11, mockFile12],
    lastFetch: 1
  })
  const { result } = renderHook(() => useDataCardFiles('1', '2'))
  expect(result.current).toStrictEqual({
    data: [mockFile1, mockFile2, mockFile3, mockFile4, mockFile5],
    fetchStatus: 'loaded'
  })
})
