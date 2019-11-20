import React from 'react'
import PropTypes from 'prop-types'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'

import preinstallIllustration from '../../assets/preinstall.svg'

const Illustration = ({ alt, iconAlt, app }) => (
  <div className="u-pos-relative u-mb-half">
    <img src={preinstallIllustration} alt={alt} />
    <div
      className="u-w-2 u-h-2 u-pos-absolute"
      style={{ top: '18px', left: '39px' }}
    >
      <AppIcon alt={iconAlt} app={app} />
    </div>
  </div>
)

Illustration.propTypes = {
  alt: PropTypes.string,
  iconAlt: PropTypes.string,
  app: PropTypes.string.isRequired
}

export default Illustration
