import { makeCountrySearchParam } from './helpers'

// no need to test all cases here
// already tested on findPlaceholderByLabelAndCountry function

describe('makeCountrySearchParam', () => {
  it('should return empty string if no match between paperDefinitions and params', () => {
    const res = makeCountrySearchParam({
      papersDefinitions: [{ label: 'caf' }],
      params: { qualificationLabel: 'isp_invoice' },
      search: ''
    })

    expect(res).toBe('')
  })

  it('should return empty string if no match between paperDefinitions and params even with a search param', () => {
    const res = makeCountrySearchParam({
      papersDefinitions: [{ label: 'caf' }],
      params: { qualificationLabel: 'isp_invoice' },
      search: '?country=fr'
    })

    expect(res).toBe('')
  })
})
