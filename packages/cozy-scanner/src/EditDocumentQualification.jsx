import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { withClient } from 'cozy-client'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import withOffline from 'cozy-ui/transpiled/helpers/withOffline'
//import ExperimentalModal from 'cozy-ui/transpiled/react/Labs/ExperimentalModal'
import DocumentQualification from './DocumentQualification'
import { getItemById, getThemeByItem } from './DocumentTypeDataHelpers'

//import ExperimentalModal from 'cozy-ui/transpiled/react/Labs/ExperimentalModal'

//import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogCloseButton from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogCloseButton'
//import Divider from '@material-ui/core/Divider'
import Button from 'cozy-ui/transpiled/react/Button'
import AppTitle from 'cozy-ui/transpiled/react/AppTitle'

const pushAnalytics = item => {
  const tracker = getTracker()
  if (tracker) {
    tracker.push(['trackEvent', 'Drive', 'Scanner', 'Edit Qualification'])
    if (item && item.label) {
      tracker.push(['trackEvent', 'Drive', 'Qualification', item.label])
    }
  }
}
/**
 * Display the Modal to Edit the category of the selected files
 */
class EditDocumentQualification extends Component {
  state = {
    qualification: undefined
  }
  render() {
    const { document, onClose, t, client, onDescribed, isOffline } = this.props
    const { qualification } = this.state
    const item =
      document.metadata && document.metadata.id
        ? getItemById(document.metadata.id)
        : null
    const itemId = item ? item.id : null

    const theme = item ? getThemeByItem(item) : null
    const categoryLabel = item ? theme.label : null
    return (
      <Dialog onClose={onClose}>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle disableTypography>
          <AppTitle>{document.name}</AppTitle>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <DocumentQualification
              onDescribed={qualification => {
                this.setState({ qualification })
              }}
              initialSelected={{
                itemId,
                categoryLabel
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            theme="secondary"
            onClick={() => onClose()}
            label={t('Scan.cancel')}
          />
          <Button
            theme="primary"
            label={t('Scan.apply')}
            onClick={async () => {
              if (isOffline) {
                Alerter.error(t('Scan.error.offline'))
              } else {
                try {
                  const fileCollection = client.collection('io.cozy.files')
                  const updatedFile = await fileCollection.updateMetadataAttribute(
                    document._id,
                    qualification
                  )
                  pushAnalytics(item)
                  if (onDescribed) onDescribed(updatedFile.data)
                  onClose()
                  Alerter.success(t('Scan.successful.qualified_ok'))
                } catch (error) {
                  Alerter.error(t('Scan.error.generic'))
                }
              }
            }}
          />
        </DialogActions>
      </Dialog>
    )
  }
}
EditDocumentQualification.propTypes = {
  document: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  client: PropTypes.object,
  onDescribed: PropTypes.func,
  isOffline: PropTypes.bool.isRequired
}
export default translate()(withOffline(withClient(EditDocumentQualification)))
