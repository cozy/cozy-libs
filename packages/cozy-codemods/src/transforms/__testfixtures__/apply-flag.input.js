import Old from './old'
import New from './old'
import React from 'react'
import flag from 'cozy-flags'

const Component = () => {
  return flag('test-flag') ? <New /> : <Old />
}

const App = () => {
  return (
    <div>
      {/* My comment */}
      {flag('test-flag') ? <Component /> : null}
    </div>
  )
}
