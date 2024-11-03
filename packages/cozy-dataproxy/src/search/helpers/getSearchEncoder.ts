import FlexSearch from 'flexsearch'
// @ts-ignore
import { encode as encode_balance } from 'flexsearch/dist/module/lang/latin/balance'

export const getSearchEncoder = (): FlexSearch.Encoders => {
  return encode_balance as FlexSearch.Encoders
}
