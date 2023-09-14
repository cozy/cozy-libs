import PropTypes from 'prop-types'
import React from 'react'

import BottomSheet, {
  BottomSheetItem,
  BottomSheetTitle
} from 'cozy-ui/transpiled/react/BottomSheet'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Divider from 'cozy-ui/transpiled/react/Divider'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import ContactList from '../../ContactList'

const SingleContactPicker = ({
  label,
  selected,
  contactModalOpened,
  setContactModalOpened,
  currentUser,
  onSelection,
  onClose
}) => {
  const { isMobile } = useBreakpoints()

  const handleSelection = contacts => {
    onSelection(contacts[0])
    onClose()
  }

  const contactListProps = {
    currentUser,
    multiple: false,
    withoutDivider: true,
    contactModalOpened,
    setContactModalOpened,
    selected: selected ? [selected] : [],
    onSelection: handleSelection
  }

  if (isMobile) {
    return (
      <BottomSheet open backdrop onClose={onClose}>
        <BottomSheetItem disableGutters>
          <BottomSheetTitle label={label} />
          <Divider />
          <ContactList {...contactListProps} />
        </BottomSheetItem>
      </BottomSheet>
    )
  }
  return (
    <ConfirmDialog
      title={label}
      open
      onClose={onClose}
      disableGutters
      componentsProps={{
        dialogTitle: {
          className: 'u-mt-1-half'
        }
      }}
      content={<ContactList {...contactListProps} />}
    />
  )
}

SingleContactPicker.propTypes = {
  label: PropTypes.string.isRequired,
  selected: PropTypes.object.isRequired,
  onSelection: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  contactModalOpened: PropTypes.bool.isRequired,
  setContactModalOpened: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired
}

export { SingleContactPicker }
