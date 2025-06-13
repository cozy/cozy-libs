import React from 'react'

import { useClient, generateWebLink } from 'cozy-client'
import { isNote, isDocs } from 'cozy-client/dist/models/file'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import styles from './styles.styl'
import { getDriveMimeTypeIcon } from '../../Search/getIconForSearchResult'

const getSlug = file => {
  if (isNote(file)) {
    return 'notes'
  }
  if (isDocs(file)) {
    return 'docs'
  }
  return 'drive'
}

const getHash = (file, slug) => {
  if (slug === 'notes') {
    return `/n/${file._id}`
  }
  if (slug === 'docs') {
    return `/bridge/docs/${file.metadata.externalId}`
  }
  return `/folder/${file.dir_id}/file/${file._id}`
}

const SourcesItem = ({ file }) => {
  const client = useClient()

  const slug = getSlug(file)
  const hash = getHash(file, slug)

  const docUrl = generateWebLink({
    slug: slug,
    cozyUrl: client?.getStackClient().uri,
    subDomainType: client?.getInstanceOptions().subdomain,
    hash: hash
  })

  return (
    <ListItem
      className={styles['sourcesItem']}
      component="a"
      href={docUrl}
      target="_blank"
      button
    >
      <ListItemIcon>
        <Icon icon={getDriveMimeTypeIcon(file)} size={32} />
      </ListItemIcon>
      <ListItemText
        primary={file.name}
        secondary={file.path.replace(file.name, '')}
      />
    </ListItem>
  )
}

export default SourcesItem
