import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import withOffline from 'cozy-ui/transpiled/react/helpers/withOffline'

import DocumentQualification from './DocumentQualification'
import { getThemeByItem } from './DocumentTypeDataHelpers'

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
      document.metadata && document.metadata.qualification
        ? document.metadata.qualification
        : null
    const theme = item ? getThemeByItem(item) : null
    const categoryLabel = item && theme ? theme.label : null
    return (
      <FixedDialog
        onClose={onClose}
        title={document.name}
        open={true}
        content={
          <DocumentQualification
            onDescribed={qualification => {
              this.setState({ qualification })
            }}
            initialSelected={{
              item,
              categoryLabel
            }}
          />
        }
        actions={
          <>
            <Button
              theme="secondary"
              onClick={onClose}
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
                    const updatedFile =
                      await fileCollection.updateMetadataAttribute(
                        document._id,
                        { qualification }
                      )
                    if (onDescribed) onDescribed(updatedFile.data)
                    onClose()
                    Alerter.success(t('Scan.successful.qualified_ok'))
                  } catch (error) {
                    Alerter.error(t('Scan.error.generic'))
                  }
                }
              }}
            />
          </>
        }
        actionsLayout="row"
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
