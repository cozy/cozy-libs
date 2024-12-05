import PropTypes from 'prop-types'
import React, { useState } from 'react'

import {
  ShareModal,
  useSharingContext,
  MemberRecipientLite,
  OwnerRecipientDefaultLite,
  LinkRecipientLite
} from 'cozy-sharing'
import Icon from 'cozy-ui/transpiled/react/Icon'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { withViewerLocales } from '../hoc/withViewerLocales'

const Sharing = ({ file, t }) => {
  const [showModal, setShowModal] = useState(false)
  const {
    isOwner,
    getDocumentPermissions,
    getSharingLink,
    allLoaded,
    getRecipients
  } = useSharingContext()

  const recipients = getRecipients(file._id)
  const permissions = getDocumentPermissions(file._id)
  const link = getSharingLink(file._id)

  return (
    <>
      <ListItem size="large" divider button onClick={() => setShowModal(true)}>
        <ListItemText
          primary={
            <>
              {t('Viewer.panel.sharing')}
              {!allLoaded && <Spinner className="u-ml-half" noMargin />}
            </>
          }
          primaryTypographyProps={{ variant: 'h6' }}
        />
        <ListItemIcon>
          <Icon icon={RightIcon} />
        </ListItemIcon>
      </ListItem>
      <List>
        <LinkRecipientLite permissions={permissions} link={link} />
        {recipients.length > 0 ? (
          recipients.map(recipient => (
            <MemberRecipientLite
              key={recipient.index}
              recipient={recipient}
              isOwner={isOwner(file._id)}
            />
          ))
        ) : (
          <OwnerRecipientDefaultLite />
        )}
      </List>
      {showModal && (
        <ShareModal
          document={file}
          documentType="Files"
          sharingDesc=""
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

Sharing.propTypes = {
  file: PropTypes.object.isRequired,
  t: PropTypes.func
}

export default withViewerLocales(Sharing)
