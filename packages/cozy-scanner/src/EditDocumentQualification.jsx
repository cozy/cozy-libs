import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { withClient } from 'cozy-client'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import withOffline from 'cozy-ui/transpiled/helpers/withOffline'
import ExperimentalModal from 'cozy-ui/transpiled/react/Labs/ExperimentalModal'
import DocumentQualification from './DocumentQualification'
import { getItemById, getThemeByItem } from './DocumentTypeDataHelpers'

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
    const item = document.metadata.id ? getItemById(document.metadata.id) : null
    const itemId = item ? item.id : null

    const theme = item ? getThemeByItem(item) : null
    const categoryLabel = item ? theme.label : null
    return (
      <ExperimentalModal
        title={document.name}
        dismissAction={onClose}
        primaryText={t('Scan.apply')}
        primaryAction={async () => {
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
              console.error('Scan.error.generic', error)
              Alerter.error(t('Scan.error.generic'))
            }
          }
        }}
        primaryType={'regular'}
        secondaryText={t('Scan.cancel')}
        secondaryAction={() => onClose()}
        secondaryType={'secondary'}
        description={
          <DocumentQualification
            onDescribed={qualification => {
              this.setState({ qualification })
            }}
            initialSelected={{
              itemId,
              categoryLabel
            }}
          />
        }
      />
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
