import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconStack from 'cozy-ui/transpiled/react/IconStack'

const FileIcon = ({ icon, faded }) => {
  return (
    <IconStack
      backgroundClassName={faded ? 'u-o-50' : ''}
      backgroundIcon={<Icon icon="file-duotone" color="#E049BF" size={32} />}
      {...(icon && {
        foregroundIcon: <Icon icon={icon} color="#E049BF" size={16} />
      })}
    />
  )
}

FileIcon.propTypes = {
  icon: PropTypes.string,
  faded: PropTypes.bool
}

export default FileIcon
