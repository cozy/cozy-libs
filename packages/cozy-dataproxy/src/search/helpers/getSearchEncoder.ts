import FlexSearch from 'flexsearch'
// @ts-expect-error module/lang/latin/balance is not described by Flexsearch types but exists
import { encode as encode_balance } from 'flexsearch/dist/module/lang/latin/balance'

export const getSearchEncoder = (): FlexSearch.Encoders => {
  return encode_balance as FlexSearch.Encoders
}
