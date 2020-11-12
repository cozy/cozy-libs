import React from 'react'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Button from 'cozy-ui/transpiled/react/Button'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import CustomIcon from './CustomIcon'

import MagnifierIcon from "cozy-ui/transpiled/react/Icons/Magnifier";
import LeftIcon from "cozy-ui/transpiled/react/Icons/Left";
import FileOutlineIcon from "cozy-ui/transpiled/react/Icons/FileOutline";
import LinkIcon from "cozy-ui/transpiled/react/Icons/Link";

const App = () => {
  return (
    <div>
      {/* My comment */}
      <Icon icon={MagnifierIcon} className="u-m-2" />
      <Icon icon={LeftIcon} className="u-m-1" />
      <Icon icon={CustomIcon} className="u-m-3" />
      <Icon icon={FileOutlineIcon} className="u-m-3" />
      <Button icon={<Icon icon={FileOutlineIcon} />} className="u-m-3" />
      <Avatar icon={<Icon icon={LinkIcon} />} className="u-m-3" />
    </div>
  );
}

export default App
