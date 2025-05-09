import React from 'react'

import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import SuggestionItemTextHighlighted from './SuggestionItemTextHighlighted'
import SuggestionItemTextSecondary from './SuggestionItemTextSecondary'

const ResultMenuItem = ({
  icon,
  primaryText,
  secondaryText,
  secondaryUrl,
  slug,
  selected,
  onClick,
  query,
  highlightQuery = false
}) => {
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

  return (
    <ListItem button size="small" selected={selected} onClick={onClick}>
      <ListItemIcon>{iconComponent}</ListItemIcon>
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  )
}

export default ResultMenuItem
