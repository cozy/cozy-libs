import PropTypes from 'prop-types'
import React from 'react'

import AppIcon from 'cozy-ui-plus/dist/AppIcon'

import PreinstallIllustration from '../../assets/preinstall.svg'

const Illustration = ({ app, alt }) => (
  <div className="u-pos-relative u-mb-half">
    <PreinstallIllustration />
    <div
      className="u-w-2 u-h-2 u-pos-absolute"
      style={{ top: '18px', left: '39px' }}
    >
      <AppIcon alt={alt} app={app} />
    </div>
  </div>
)

Illustration.propTypes = {
  app: PropTypes.string.isRequired,
  alt: PropTypes.string
}

export default Illustration
