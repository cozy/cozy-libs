import PropTypes from 'prop-types'
import React from 'react'

import { ExtendableFab } from 'cozy-ui/transpiled/react/Fab'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getIconWithlabel, openExternalLink } from './helpers/sharings'
import withLocales from './hoc/withLocales'

const makeStyles = customStyle => {
  const { position, right, bottom, ...rest } = customStyle
  return {
    position: position ?? 'fixed',
    right: right ?? '1rem',
    bottom: bottom ?? '1rem',
    ...rest
  }
}

/**
 * OpenSharingLinkFabButton component renders a ExtendableFab button
 * that opens an link for Add/Synchronize/Create Cozy when clicked.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.link - The URL to be opened when the button is clicked.
 * @param {boolean} [props.isSharingShortcutCreated=false] - Indicates if a sharing shortcut has been created. (default false)
 * @param {boolean} [props.isShortLabel] - Display a short label for the button.
 * @param {Object} [props] - Additional props to be passed to the ExtendableFab component.
 */
const OpenSharingLinkFabButton = ({
  link,
  isSharingShortcutCreated = false,
  isShortLabel,
  ...props
}) => {
  const { style = {}, ...rest } = props
  const { t } = useI18n()
  const fabStyles = makeStyles(style)

  const handleClick = () => {
    openExternalLink(link)
  }

  const { icon, label } = getIconWithlabel({
    link,
    isSharingShortcutCreated,
    isShortLabel,
    t
  })

  return (
    <ExtendableFab
      color="primary"
      label={label}
      style={fabStyles}
      icon={icon}
      follow={window}
      onClick={handleClick}
      {...rest}
    />
  )
}

OpenSharingLinkFabButton.propTypes = {
  link: PropTypes.string.isRequired,
  isSharingShortcutCreated: PropTypes.bool,
  isShortLabel: PropTypes.bool
}

export default withLocales(OpenSharingLinkFabButton)
