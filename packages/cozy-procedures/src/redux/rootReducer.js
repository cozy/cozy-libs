import { combineReducers } from 'redux'

import documentsDataSlice from './documentsDataSlice'
import personalDataSlice from './personalDataSlice'
import procedureDataSlice from './procedureDataSlice'

const rootReducer = combineReducers({
  procedureData: procedureDataSlice,
  personalData: personalDataSlice,
  documents: documentsDataSlice
})

export default rootReducer
