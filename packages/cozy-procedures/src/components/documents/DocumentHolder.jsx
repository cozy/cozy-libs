import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  translate,
  Card,
  Icon,
  Modal,
  SubTitle,
  Text,
  Viewer
} from 'cozy-ui/transpiled/react/'
import { CozyFile } from 'cozy-doctypes'
import DocumentsDataFormContainer from '../../containers/DocumentsDataForm'
import flow from 'lodash/flow'

class DocumentHolder extends Component {
  state = {
    isUnlinkConfirmationModalOpened: false,
    isViewerModalOpened: false,
    file: false
  }

  render() {
    const { document, unlinkDocument, documentId, t } = this.props
    const { isUnlinkConfirmationModalOpened, isViewerModalOpened } = this.state

    const splittedName = CozyFile.splitFilename(document)
    return (
      <>
        {isUnlinkConfirmationModalOpened && (
          <Modal
            primaryText={t('documents.unlink.unlink')}
            primaryAction={() => unlinkDocument({ document, documentId })}
            secondaryText={t('cancel')}
            secondaryAction={() =>
              this.setState({ isUnlinkConfirmationModalOpened: false })
            }
            title={t('documents.unlink.title')}
            description={
              <>
                <SubTitle>{t('documents.unlink.subtitle')}</SubTitle>
                <Text className="u-mt-1">{t('documents.unlink.text')}</Text>
              </>
            }
          />
        )}
        {isViewerModalOpened && (
          <Modal
            into="body"
            mobileFullscreen
            closable={false}
            style={{ minHeight: '80vh' }}
          >
            <Viewer
              onCloseRequest={() => {
                this.setState({ isViewerModalOpened: false })
              }}
              files={[document]}
            />
          </Modal>
        )}
        <Card
          className="u-flex u-flex-row u-flex-items-center"
          onClick={() => {
            this.setState({ isViewerModalOpened: true })
          }}
        >
          <Icon
            icon={`file-type-${document.class}`}
            size={24}
            className="u-mr-1"
          />
          <span className="u-flex-grow-1 u-ellipsis">
            {splittedName.filename}
            <span className="u-coolGrey">{splittedName.extension}</span>
          </span>
          <Icon
            icon="cross"
            size={16}
            className="u-pr-1 u-c-pointer"
            onClick={() => this.setState({ isModalOpened: true })}
          />
        </Card>
      </>
    )
  }
}

DocumentHolder.propTypes = {
  unlinkDocument: PropTypes.func.isRequired,
  documentId: PropTypes.string.isRequired,
  //io.cozy.files
  document: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}
export default flow(translate())(DocumentsDataFormContainer(DocumentHolder))
