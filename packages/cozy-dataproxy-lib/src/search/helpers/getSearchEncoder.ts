import FlexSearch from 'flexsearch'
// @ts-expect-error module/lang/latin/balance is not described by Flexsearch types but exists
import { encode as encode_simple } from 'flexsearch/dist/module/lang/latin/simple'

export const getSearchEncoder = (): FlexSearch.Encoders => {
  return encode_simple as FlexSearch.Encoders
}
