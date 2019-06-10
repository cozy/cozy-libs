import { createSlice } from 'redux-starter-kit'

const amountSlice = createSlice({
  initialState: 20000,
  slice: 'amount',
  reducers: {
    update: (state, action) => {
      return action.payload.value
    }
  }
})

const { actions, reducer } = amountSlice
export const { update } = actions
export default reducer
