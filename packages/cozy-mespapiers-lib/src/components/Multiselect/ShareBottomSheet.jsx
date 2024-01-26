import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import BottomSheet, {
  BottomSheetItem
} from 'cozy-ui/transpiled/react/BottomSheet'
import Icon from 'cozy-ui/transpiled/react/Icon'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import MultiselectBackdrop from './MultiselectBackdrop'
import { makeZipFolder } from '../Actions/utils'
import { useFileSharing } from '../Contexts/FileSharingProvider'

const ShareBottomSheet = ({ onClose, fileId, docs }) => {
  const { t, f } = useI18n()
  const navigate = useNavigate()
  const client = useClient()
  const { showAlert } = useAlert()
  const { shareFiles } = useFileSharing()
  const [isBackdropOpen, setIsBackdropOpen] = useState(false)

  const shareAsAttachment = async () => {
    const idsToShare = fileId ? [fileId] : docs.map(doc => doc._id)
    try {
      await shareFiles(idsToShare)
      showAlert(
        t('ShareBottomSheet.attachmentResponse.success', {
          smart_count: idsToShare.length
        }),
        'success'
      )
    } catch (error) {
      if (error.message === 'User did not share') return

      showAlert(t('ShareBottomSheet.attachmentResponse.error'), 'error')
    }
  }

  const shareByLink = async () => {
    let fileToForward

    if (fileId) {
      fileToForward = { _id: fileId }
    } else if (docs.length === 1) {
      fileToForward = docs[0]
    } else {
      setIsBackdropOpen(true)
      fileToForward = await makeZipFolder({ client, docs, t, f })
      setIsBackdropOpen(false)
    }

    navigate(`../forward/${fileToForward._id}`)
  }

  return (
    <>
      {isBackdropOpen && <MultiselectBackdrop />}

      {!isBackdropOpen && (
        <BottomSheet backdrop onClose={onClose}>
          <BottomSheetItem disableGutters>
            <List>
              <ListItem button onClick={shareAsAttachment}>
                <ListItemIcon>
                  <Icon icon="attachment" />
                </ListItemIcon>
                <ListItemText primary={t('ShareBottomSheet.attachment')} />
              </ListItem>
              <ListItem button onClick={shareByLink}>
                <ListItemIcon>
                  <Icon icon="link" />
                </ListItemIcon>
                <ListItemText primary={t('ShareBottomSheet.link')} />
              </ListItem>
            </List>
          </BottomSheetItem>
        </BottomSheet>
      )}
    </>
  )
}

ShareBottomSheet.propTypes = {
  onClose: PropTypes.func,
  fileId: PropTypes.string,
  docs: PropTypes.array
}

export default ShareBottomSheet
