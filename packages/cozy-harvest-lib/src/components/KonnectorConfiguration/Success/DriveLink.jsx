import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ButtonLink } from 'cozy-ui/react/Button'
import { queryConnect } from 'cozy-client'

import withLocales from '../../hoc/withLocales'

export class DriveLink extends PureComponent {
  render() {
    const { folderId, driveQuery, t } = this.props
    let hasDrive = false
    if (driveQuery.fetchStatus === 'loaded') {
      if (driveQuery.data.length > 0) {
        hasDrive = true
      }
    }
    const href =
      hasDrive && `${driveQuery.data[0].links.related}#/files/${folderId}`

    return (
      <ButtonLink
        href={href ? href : undefined}
        target="_parent"
        disabled={!hasDrive}
        subtle
        icon="openwith"
        label={t('account.success.driveLinkText')}
      />
    )
  }
}

DriveLink.propTypes = {
  t: PropTypes.func.isRequired,
  folderId: PropTypes.string.isRequired,
  driveQuery: PropTypes.object.isRequired
}
export default queryConnect({
  driveQuery: {
    query: client => client.all('io.cozy.apps').where({ slug: 'drive' }),
    as: 'driveQuery'
  }
})(withLocales(DriveLink))
