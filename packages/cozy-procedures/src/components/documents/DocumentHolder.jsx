import flow from 'lodash/flow'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { CozyFile } from 'cozy-doctypes'
import {
  translate,
  Icon,
  Modal,
  SubTitle,
  Text,
  Viewer
} from 'cozy-ui/transpiled/react/'
import Card from 'cozy-ui/transpiled/react/Card'
import CrossIcon from 'cozy-ui/transpiled/react/Icons/Cross'

import DocumentsDataFormContainer from '../../containers/DocumentsDataForm'

class DocumentHolder extends Component {
  state = {
    isUnlinkConfirmationModalOpened: false,
    isViewerModalOpened: false,
    file: false
  }

  render() {
    const { document, unlinkDocument, categoryId, t, index } = this.props
    const { isUnlinkConfirmationModalOpened, isViewerModalOpened } = this.state

    const splittedName = CozyFile.splitFilename(document)
    return (
      <>
        {isUnlinkConfirmationModalOpened && (
          <Modal
            primaryText={t('documents.unlink.unlink')}
            primaryAction={() => unlinkDocument({ categoryId, index })}
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
          className="u-flex u-flex-row u-flex-items-center u-c-pointer"
          onClick={() => {
            this.setState({ isViewerModalOpened: true })
          }}
        >
          <Icon
            icon={`file-type-${document.class}`}
            size={24}
            className="u-mr-1 u-flex-shrink-0"
          />
          <span className="u-flex-grow-1 u-ellipsis">
            {splittedName.filename}
            <span className="u-coolGrey">{splittedName.extension}</span>
          </span>
          <Icon
            icon={CrossIcon}
            size={16}
            className="u-pr-1 u-c-pointer u-flex-shrink-0"
            onClick={e => {
              e.stopPropagation()
              this.setState({ isUnlinkConfirmationModalOpened: true })
            }}
          />
        </Card>
      </>
    )
  }
}

DocumentHolder.propTypes = {
  unlinkDocument: PropTypes.func.isRequired,
  categoryId: PropTypes.string.isRequired,
  // io.cozy.files
  document: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}
export default flow(translate())(DocumentsDataFormContainer(DocumentHolder))
