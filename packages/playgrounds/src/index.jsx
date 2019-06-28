import React from 'react'
import ReactDOM from 'react-dom'

import Nav from './common/Nav'
import { LogoutButton } from './common/components'

const App = () => {
  return (
    <div>
      <Nav />
      <LogoutButton />
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#app'))
