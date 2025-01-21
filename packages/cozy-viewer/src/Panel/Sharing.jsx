import PropTypes from 'prop-types'
import React from 'react'

import {
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
import { useShareModal } from '../providers/ShareModalProvider'

const Sharing = ({ file, t }) => {
  const { setShowShareModal } = useShareModal()
  const {
    isOwner,
    getDocumentPermissions,
    getSharingLink,
    allLoaded,
    hasSharedParent,
    getRecipients
  } = useSharingContext()

  const shareFileRefId = hasSharedParent(file.path) ? file.dir_id : file._id
  const recipients = getRecipients(shareFileRefId)
  const permissions = getDocumentPermissions(shareFileRefId)
  const link = getSharingLink(shareFileRefId)
  const _isOwner = isOwner(shareFileRefId)

  return (
    <>
      <ListItem
        size="large"
        divider
        button
        onClick={() => setShowShareModal(true)}
      >
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
          <Icon icon={RightIcon} color="var(--secondaryTextColor)" />
        </ListItemIcon>
      </ListItem>
      <List>
        <LinkRecipientLite permissions={permissions} link={link} />
        {recipients.length > 0 ? (
          recipients.map(recipient => (
            <MemberRecipientLite
              key={recipient.index}
              recipient={recipient}
              isOwner={_isOwner}
            />
          ))
        ) : (
          <OwnerRecipientDefaultLite />
        )}
      </List>
    </>
  )
}

Sharing.propTypes = {
  file: PropTypes.object.isRequired,
  t: PropTypes.func
}

export default withViewerLocales(Sharing)
