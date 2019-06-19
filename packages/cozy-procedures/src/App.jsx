import React from 'react'
import { Provider } from 'react-redux'

import store from './redux/store'
import Context from './redux/context'
import Procedure from './containers/Procedure'

const App = props => (
  <Provider store={store} context={Context}>
    <Procedure {...props} />
  </Provider>
)

export default App
