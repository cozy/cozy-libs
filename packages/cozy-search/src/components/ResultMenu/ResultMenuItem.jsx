import React, { useEffect, useRef } from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import AppIcon from 'cozy-ui-plus/dist/AppIcon'

import SuggestionItemTextHighlighted from './SuggestionItemTextHighlighted'
import SuggestionItemTextSecondary from './SuggestionItemTextSecondary'
import styles from './styles.styl'

const ResultMenuItem = ({
  icon,
  url,
  primaryText,
  secondaryText,
  secondaryUrl,
  slug,
  selected,
  query,
  highlightQuery = false,
  onClear
}) => {
  const itemRef = useRef()

  const iconComponent =
    icon.type === 'component' ? (
      <Icon icon={icon.component} size={32} />
    ) : icon.type === 'app' ? (
      <AppIcon app={icon.app} />
    ) : (
      icon
    )

  const primary = highlightQuery ? (
    <SuggestionItemTextHighlighted text={primaryText} query={query} />
  ) : (
    primaryText
  )

  const secondary = highlightQuery ? (
    <SuggestionItemTextSecondary
      text={secondaryText}
      query={query}
      slug={slug}
      url={secondaryUrl}
    />
  ) : (
    secondaryText
  )

  useEffect(() => {
    if (selected) {
      itemRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }, [selected])

  return (
    <ListItem
      component="a"
      href={url}
      ref={itemRef}
      size="small"
      selected={selected}
      className={styles.resultMenuItem}
      onClick={onClear}
    >
      <ListItemIcon>{iconComponent}</ListItemIcon>
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  )
}

export default ResultMenuItem
