import React from 'react'

import { generateWebLink } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Link from 'cozy-ui/transpiled/react/Link'

import ActionMenuItemWrapper from '../ActionMenuItemWrapper'

export const viewInDrive = ({ client }) => {
  return {
    Component: function ViewInDrive({ onClick, className, files }) {
      const { t } = useI18n()
      const dirId = files[0].dir_id

      const webLink = generateWebLink({
        slug: 'drive',
        cozyUrl: client.getStackClient().uri,
        subDomainType: client.getInstanceOptions().subdomain,
        pathname: '/',
        hash: `folder/${dirId}`
      })

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="folder"
          text={t('action.viewInDrive')}
          onClick={onClick}
        >
          <Link href={webLink} target="_blank" className={'u-p-0'}>
            {t('action.viewInDrive')}
          </Link>
        </ActionMenuItemWrapper>
      )
    }
  }
}
