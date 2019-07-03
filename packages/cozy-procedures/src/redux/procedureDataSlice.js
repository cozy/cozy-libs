import get from 'lodash/get'
import { createSlice } from 'redux-starter-kit'

const procedureDataSlice = createSlice({
  initialState: {
    data: {
      amount: null,
      duration: null
    },
    ui: {
      initialized: false
    }
  },
  slice: 'procedureData',
  reducers: {
    updateAmount: (state, action) => {
      state.data.amount = action.payload
    },
    updateDuration: (state, action) => {
      state.data.duration = action.payload
    },
    initializationSuccess: state => {
      state.ui.initialized = true
    }
  }
})

const { actions, reducer } = procedureDataSlice

export const { updateAmount, updateDuration, initializationSuccess } = actions

const selectors = {
  getAmount: state => get(state, [procedureDataSlice.slice, 'data', 'amount']),
  getDuration: state =>
    get(state, [procedureDataSlice.slice, 'data', 'duration']),
  getInitialized: state =>
    get(state, [procedureDataSlice.slice, 'ui', 'initialized'], false)
}

export const { getAmount, getDuration, getInitialized } = selectors

export default reducer
