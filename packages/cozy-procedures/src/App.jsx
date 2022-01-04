import React from 'react'
import { Provider } from 'react-redux'

import store from './redux/store'
import Context from './redux/context'
import Procedure from './containers/Procedure'

function App(props) {
  return (
    <Provider store={store} context={Context}>
      <Procedure {...props} />
    </Provider>
  )
}

export default App
