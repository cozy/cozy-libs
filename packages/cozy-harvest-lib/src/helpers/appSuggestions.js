import get from 'lodash/get'

export const getSuggestionReason = (suggestion = {}) =>
  get(suggestion, 'reason')

export default {
  getSuggestionReason
}
