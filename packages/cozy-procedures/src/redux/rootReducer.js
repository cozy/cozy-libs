import { combineReducers } from 'redux'
import personalDataSlice from './personalDataSlice'
import documentsSlice from './documentsSlice'
import amountSlice from './amountSlice'
import durationSlice from './durationSlice'

const rootReducer = combineReducers({
  personalData: personalDataSlice,
  documents: documentsSlice,
  amount: amountSlice,
  duration: durationSlice
})

export default rootReducer
