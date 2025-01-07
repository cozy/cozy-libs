import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'

import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { checkIsReadOnlyPermissions } from '../../helpers/permissions'
import { ShareRestrictionModal } from '../ShareRestrictionModal/ShareRestrictionModal'

const LinkRecipientPermissions = ({ className, document, permissions }) => {
  const { t } = useI18n()
  const buttonRef = useRef()
  const [openShareRestrictionModal, setOpenShareRestrictionModal] =
    useState(false)

  const isReadOnlyPermissions = checkIsReadOnlyPermissions(permissions)

  return (
    <div className={className}>
      <>
        <DropdownButton
          ref={buttonRef}
          textVariant="body2"
          onClick={() => setOpenShareRestrictionModal(true)}
        >
          {t(
            `Share.type.${isReadOnlyPermissions ? 'one-way' : 'two-way'}`
          ).toLowerCase()}
        </DropdownButton>
        {openShareRestrictionModal && (
          <ShareRestrictionModal
            file={document}
            onClose={() => setOpenShareRestrictionModal(false)}
          />
        )}
      </>
    </div>
  )
}

LinkRecipientPermissions.propTypes = {
  className: PropTypes.string,
  document: PropTypes.object.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default LinkRecipientPermissions
