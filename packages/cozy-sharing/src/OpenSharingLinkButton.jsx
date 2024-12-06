import PropTypes from 'prop-types'
import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getIconWithlabel, openExternalLink } from './helpers/sharings'

/**
 * OpenSharingLinkButton component renders a Button
 * that opens an link for Add/Synchronize/Create Cozy when clicked.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.link - The URL to be opened when the button is clicked.
 * @param {boolean} [props.isSharingShortcutCreated=false] - Indicates if a sharing shortcut has been created. (default false)
 * @param {Object} [props] - Additional props to be passed to the Button component.
 */
export const OpenSharingLinkButton = ({
  link,
  isSharingShortcutCreated = false,
  ...props
}) => {
  const { t } = useI18n()

  const handleClick = () => {
    openExternalLink(link)
  }

  const { icon, label } = getIconWithlabel({
    link,
    isSharingShortcutCreated,
    t
  })

  return (
    <Button
      onClick={handleClick}
      startIcon={<Icon icon={icon} />}
      label={label}
      {...props}
    />
  )
}

OpenSharingLinkButton.propTypes = {
  link: PropTypes.string,
  isSharingShortcutCreated: PropTypes.bool
}
