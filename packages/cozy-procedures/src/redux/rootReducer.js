import { combineReducers } from 'redux'
import personalDataSlice from './personalDataSlice'
import documentsDataSlice from './documentsDataSlice'
import amountSlice from './amountSlice'
import durationSlice from './durationSlice'

const rootReducer = combineReducers({
  personalData: personalDataSlice,
  documents: documentsDataSlice,
  amount: amountSlice,
  duration: durationSlice
})

export default rootReducer
