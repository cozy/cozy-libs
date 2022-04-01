import { createMockClient } from 'cozy-client'

import { getFilteredStoreUrl } from 'src/helpers/getFilteredStoreUrl'

describe('getFilteredStoreUrl', () => {
  it('should return correct store url', () => {
    const protocol = 'https'
    const subdomain = 'john'
    const domain = 'mycozy.cloud'
    const client = createMockClient({
      clientOptions: {
        uri: `${protocol}://${subdomain}.${domain}/`
      }
    })
    const universalLink =
      'https://links.mycozy.cloud/store/discover/?type=konnector&doctype=io.cozy.files'
    const nativePath = '#/discover/?type=konnector&doctype=io.cozy.files'

    const res = decodeURIComponent(getFilteredStoreUrl(client))
    const expected = `${universalLink}&fallback=${protocol}://${subdomain}-store.${domain}/${nativePath}`

    expect(res).toEqual(expected)
  })
})
