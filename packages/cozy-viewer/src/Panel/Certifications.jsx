import has from 'lodash/has'
import PropTypes from 'prop-types'
import React from 'react'

import Icon, { iconPropType } from 'cozy-ui/transpiled/react/Icon'
import CarbonCopyIcon from 'cozy-ui/transpiled/react/Icons/CarbonCopy'
import SafeIcon from 'cozy-ui/transpiled/react/Icons/Safe'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/deprecated/Media'

import { withViewerLocales } from '../hoc/withViewerLocales'

const Certification = ({ icon, title, caption }) => {
  return (
    <div className="u-ph-2 u-pv-1">
      <Media className="u-mb-half" align="top">
        <Img className="u-mr-half">
          <Icon icon={icon} />
        </Img>
        <Bd>
          <Typography variant="body1">{title}</Typography>
        </Bd>
      </Media>
      <Typography variant="caption">{caption}</Typography>
    </div>
  )
}

Certification.propTypes = {
  icon: iconPropType.isRequired,
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired
}

const Certifications = ({ file, t }) => {
  const hasCarbonCopy = has(file, 'metadata.carbonCopy')
  const hasElectronicSafe = has(file, 'metadata.electronicSafe')

  return (
    <div className="u-pv-1">
      {hasCarbonCopy && (
        <Certification
          icon={CarbonCopyIcon}
          title={t('Viewer.panel.certifications.carbonCopy.title')}
          caption={t('Viewer.panel.certifications.carbonCopy.caption')}
        />
      )}
      {hasElectronicSafe && (
        <Certification
          icon={SafeIcon}
          title={t('Viewer.panel.certifications.electronicSafe.title')}
          caption={t('Viewer.panel.certifications.electronicSafe.caption')}
        />
      )}
    </div>
  )
}

Certifications.propTypes = {
  file: PropTypes.object.isRequired
}

export default withViewerLocales(Certifications)
