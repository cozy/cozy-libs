import { createSlice } from 'redux-starter-kit'

const durationSlice = createSlice({
  initialState: 24,
  slice: 'duration',
  reducers: {
    update: (state, action) => {
      return action.payload.value
    }
  }
})

const { actions, reducer } = durationSlice
export const { update } = actions
export default reducer
