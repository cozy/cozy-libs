import React from 'react'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Button from 'cozy-ui/transpiled/react/Button'
import CustomIcon from './CustomIcon'

const App = () => {
  return (
    <div>
      {/* My comment */}
      <Icon icon="magnifier" className="u-m-2" />
      <Icon icon="left" className="u-m-1" />
      <Icon icon={CustomIcon} className="u-m-3" />
      <Icon icon="file-outline" className="u-m-3" />
      <Button icon="file-outline" className="u-m-3" />
    </div>
  )
}

export default App
