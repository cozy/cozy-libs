import { createSlice } from 'redux-starter-kit'
import get from 'lodash/get'

const personalDataSlice = createSlice({
  initialState: null,
  slice: 'personalData',
  reducers: {
    init: (state, action) => {
      return Object.keys(action.payload).reduce((acc, fieldId) => {
        acc[fieldId] = undefined
        return acc
      }, {})
    },
    update: (state, action) => {
      return action.payload
    }
  }
})

const selectors = {
  getSlice: state => get(state, personalDataSlice.slice)
}

const { actions, reducer } = personalDataSlice
export const { init, update } = actions
export const { getSlice } = selectors
export default reducer
