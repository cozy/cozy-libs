import get from 'lodash/get'
import { createSlice } from 'redux-starter-kit'

const procedureDataSlice = createSlice({
  initialState: {
    amount: null,
    duration: null
  },
  slice: 'procedureData',
  reducers: {
    updateAmount: (state, action) => {
      state.amount = action.payload
    },
    updateDuration: (state, action) => {
      state.duration = action.payload
    }
  }
})

const { actions, reducer } = procedureDataSlice

export const { updateAmount, updateDuration } = actions

const selectors = {
  getAmount: state => get(state, ['procedureData', 'amount']),
  getDuration: state => get(state, ['procedureData', 'duration'])
}

export const { getAmount, getDuration } = selectors

export default reducer
