import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import styles from './styles.styl'
import EmailIcon from '../../Search/Icons/EmailIcon'

const EmailSourceItem = ({ email }) => {
  // we need to get mailId in orer to generate the link to the email
  const docUrl = 'email link to be implemented'
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
      <ListItemText primary={email.id} secondary={email.date} />
    </ListItem>
  )
}

export default EmailSourceItem
