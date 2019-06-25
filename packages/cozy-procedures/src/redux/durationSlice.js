import { createSlice } from 'redux-starter-kit'
import get from 'lodash/get'

const durationSlice = createSlice({
  initialState: null,
  slice: 'duration',
  reducers: {
    update: (state, action) => {
      return action.payload
    }
  }
})

const selectors = {
  getSlice: state => get(state, durationSlice.slice)
}
export const { getSlice } = selectors

const { actions, reducer } = durationSlice
export const { update } = actions
export default reducer
