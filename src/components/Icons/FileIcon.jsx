import React from 'react'
import PropTypes from 'prop-types'

import IconStack from 'cozy-ui/transpiled/react/IconStack'
import Icon from 'cozy-ui/transpiled/react/Icon'

const FileIcon = ({ icon, faded }) => {
  return (
    <IconStack
      backgroundClassName={faded ? 'u-o-50' : ''}
      backgroundIcon={<Icon icon="file-duotone" color="#E049BF" size={32} />}
      foregroundIcon={<Icon icon={icon} color="#E049BF" size={16} />}
    />
  )
}

FileIcon.propTypes = {
  icon: PropTypes.string,
  faded: PropTypes.bool
}

export default FileIcon
