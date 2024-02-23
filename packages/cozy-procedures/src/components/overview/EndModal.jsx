import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router'

import { withClient } from 'cozy-client'
import {
  Modal,
  ModalContent,
  ModalFooter,
  Title,
  translate,
  Button,
  ButtonLink
} from 'cozy-ui/transpiled/react/'
import AppLinker, {
  generateUniversalLink
} from 'cozy-ui/transpiled/react/AppLinker'

import IllustrationError from '../../assets/error.svg'
import IllustrationOK from '../../assets/ok.svg'

class EndModal extends React.Component {
  exitProcedure = () => {
    this.props.router.push('/')
  }

  render() {
    const { t, isSuccessful, onClose, client, folderId } = this.props
    const translationKey = isSuccessful ? 'success' : 'error'
    const cozyUrl = client.getStackClient().uri

    const slug = 'drive'
    const path = `#/folder/${folderId}`

    const fallbackUrl = generateUniversalLink({
      slug,
      cozyUrl,
      nativePath: path
    })

    return (
      <Modal
        secondaryAction={isSuccessful ? this.exitProcedure : onClose}
        mobileFullscreen
      >
        <ModalContent>
          <div className="u-mh-auto u-mb-1 u-ta-center">
            {isSuccessful ? <IllustrationOK /> : <IllustrationError />}
          </div>
          <Title className="u-mb-2 u-ta-center">
            {t(`${translationKey}.title`)}
          </Title>
          <p className="u-mb-2 u-ta-center">{t(`${translationKey}.text`)}</p>
        </ModalContent>
        <ModalFooter>
          {isSuccessful ? (
            <AppLinker slug={slug} nativePath={path} href={fallbackUrl}>
              {({ onClick, href }) => (
                <ButtonLink
                  extension="full"
                  className="u-mb-half"
                  onClick={onClick}
                  href={href}
                >
                  {t('success.main_action')}
                </ButtonLink>
              )}
            </AppLinker>
          ) : (
            <Button onClick={onClose} extension="full" className="u-mb-half">
              {t('error.main_action')}
            </Button>
          )}
          <Button
            onClick={this.exitProcedure}
            theme="secondary"
            extension="full"
          >
            {t(`${translationKey}.secondary_action`)}
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

EndModal.propTypes = {
  isSuccessful: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  folderId: PropTypes.string,
  client: PropTypes.object,
  t: PropTypes.func.isRequired
}

EndModal.defaultProps = {
  folderId: ''
}

export default withClient(withRouter(translate()(EndModal)))
