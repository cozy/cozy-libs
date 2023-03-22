import React from 'react'

import { generateWebLink } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Link from 'cozy-ui/transpiled/react/Link'

import withLocales from '../../../locales/withLocales'
import ActionMenuItemWrapper from '../ActionMenuItemWrapper'

export const viewInDrive = ({ client }) => {
  return {
    name: 'viewInDrive',
    Component: withLocales(({ onClick, className, docs }) => {
      const { t } = useI18n()
      const dirId = docs[0].dir_id

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
          <Link href={webLink} target="_blank" className="u-p-0">
            {t('action.viewInDrive')}
          </Link>
        </ActionMenuItemWrapper>
      )
    })
  }
}
