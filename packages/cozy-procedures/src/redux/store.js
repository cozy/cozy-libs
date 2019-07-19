import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import logger from 'redux-logger'
import rootReducer from './rootReducer'

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), logger]
})

export default store
