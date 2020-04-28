import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import Recipient from './Recipient'
import { SubTitle } from 'cozy-ui/transpiled/react'

const WhoHasAccess = ({
  isOwner = false,
  recipients,
  document,
  documentType,
  onRevoke,
  className,
  onRevokeSelf,
  t
}) => {
  return (
    <div className={className}>
      {recipients.length > 1 && (
        <SubTitle>
          {t(`${documentType}.share.whoHasAccess.title`, {
            smart_count: recipients.length
          })}
        </SubTitle>
      )}
      {recipients.map((recipient, index) => (
        <Recipient
          {...recipient}
          key={`key_r_${index}`}
          isOwner={isOwner}
          document={document}
          documentType={documentType}
          onRevoke={onRevoke}
          onRevokeSelf={onRevokeSelf}
        />
      ))}
    </div>
  )
}
WhoHasAccess.propTypes = {
  isOwner: PropTypes.bool,
  recipients: PropTypes.array.isRequired,
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  onRevoke: PropTypes.func.isRequired,
  onRevokeSelf: PropTypes.func
}
export default translate()(WhoHasAccess)
