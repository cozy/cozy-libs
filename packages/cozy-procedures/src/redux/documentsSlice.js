/*eslint no-unused-vars: off*/
/*eslint no-console: off*/
import { createSlice } from 'redux-starter-kit'

const documentsSlice = createSlice({
  initialState: null,
  slice: 'documents',
  reducers: {
    init: (state, action) => {
      console.warn('init documents slice not implemented')
      return state
    },
    update: (state, action) => {
      console.warn('update documents slice not implemented')
      return state
    }
  }
})

const { actions, reducer } = documentsSlice
export const { init, update } = actions
export default reducer
