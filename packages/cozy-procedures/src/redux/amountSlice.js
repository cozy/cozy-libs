import { createSlice } from 'redux-starter-kit'
import get from 'lodash/get'

const amountSlice = createSlice({
  initialState: 20000,
  slice: 'amount',
  reducers: {
    update: (state, action) => {
      return action.payload
    }
  }
})

const selectors = {
  getSlice: state => get(state, amountSlice.slice)
}

export const { getSlice } = selectors
const { actions, reducer } = amountSlice
export const { update } = actions
export default reducer
