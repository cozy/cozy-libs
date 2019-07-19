import { combineReducers } from 'redux'
import procedureDataSlice from './procedureDataSlice'
import personalDataSlice from './personalDataSlice'
import documentsDataSlice from './documentsDataSlice'

const rootReducer = combineReducers({
  procedureData: procedureDataSlice,
  personalData: personalDataSlice,
  documents: documentsDataSlice
})

export default rootReducer
