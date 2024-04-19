import React from 'react'
import { Provider } from 'react-redux'

import Procedure from './containers/Procedure'
import Context from './redux/context'
import store from './redux/store'

const App = props => (
  <Provider store={store} context={Context}>
    <Procedure {...props} />
  </Provider>
)

export default App
