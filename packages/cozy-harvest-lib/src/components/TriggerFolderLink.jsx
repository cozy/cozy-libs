import React, { PureComponent } from 'react'

import { ButtonLink } from 'cozy-ui/react/Button'

import { queryConnect } from 'cozy-client'

export class TriggerFolderLink extends PureComponent {
  render() {
    const { label, folderId, driveQuery } = this.props
    let hasDrive = false
    if (driveQuery.fetchStatus === 'loaded') {
      if (driveQuery.data.length > 0) {
        hasDrive = true
      }
    }
    const href =
      hasDrive && `${driveQuery.data[0].links.related}#/files/${folderId}`

    return href ? (
      <ButtonLink
        href={href}
        target="_parent"
        subtle
        icon="openwith"
        label={label}
      />
    ) : (
      <ButtonLink
        subtle
        disabled
        className={'u-silver u-c-not-allowed'}
        icon="openwith"
        label={label}
      />
    )
  }
}

export default queryConnect({
  driveQuery: {
    query: client => client.all('io.cozy.apps').where({ slug: 'drive' }),
    as: 'driveQuery'
  }
})(TriggerFolderLink)
