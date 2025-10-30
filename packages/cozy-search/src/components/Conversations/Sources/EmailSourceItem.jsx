import React from 'react'

import { useClient, generateWebLink } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import styles from './styles.styl'
import EmailIcon from '../../Search/Icons/EmailIcon'

const EmailSourceItem = ({ email }) => {
  const client = useClient()

  const docUrl = generateWebLink({
    slug: 'mail',
    cozyUrl: client?.getStackClient().uri,
    subDomainType: client?.getInstanceOptions().subdomain,
    hash: `/bridge/dashboard/${email.id}`
  })
  const dateSplit = email['email.date'].split('T')
  const emailDate = dateSplit && dateSplit.length > 0 ? dateSplit[0] : ''

  return (
    <ListItem
      className={styles['sourcesItem']}
      component="a"
      href={docUrl}
      target="_blank"
      button
    >
      <ListItemIcon>
        <Icon icon={EmailIcon} size={32} />
      </ListItemIcon>
      <ListItemText
        primary={`${emailDate} - ${email['email.subject']}`}
        secondary={`${email['email.preview']}`}
      />
    </ListItem>
  )
}

export default EmailSourceItem
