import React from 'react'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CustomIcon from './CustomIcon'

import MagnifierIcon from "cozy-ui/transpiled/react/Icons/Magnifier";
import LeftIcon from "cozy-ui/transpiled/react/Icons/Left";
import FileOutlineIcon from "cozy-ui/transpiled/react/Icons/FileOutline";

const App = () => {
  return (
    <div>
      {/* My comment */}
      <Icon icon={MagnifierIcon} className="u-m-2" />
      <Icon icon={LeftIcon} className="u-m-1" />
      <Icon icon={CustomIcon} className="u-m-3" />
      <Icon icon={FileOutlineIcon} className="u-m-3" />
    </div>
  );
}

export default App
