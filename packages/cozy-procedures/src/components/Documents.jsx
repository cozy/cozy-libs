import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Topbar from './Topbar'
import { Title, translate, Label, Button } from 'cozy-ui/transpiled/react/'
import EmptyDocumentHolder from './documents/EmptyDocumentHolder'
import LoadingDocumentHolder from './documents/LoadingDocumentHolder'
import DocumentHolder from './documents/DocumentHolder'
import { creditApplicationTemplate } from 'cozy-procedures'

class Documents extends React.Component {
  render() {
    const { t, router } = this.props
    const { documents: documentsTemplate } = creditApplicationTemplate
    const fields = Object.values(documentsTemplate).sort(
      document => document.order
    )
    return (
      <div>
        <Topbar title={t('documents.title')} />
        <Title>{t('documents.subtitle')}</Title>
        <div>
          <Label>Demo, to remove</Label>
          <EmptyDocumentHolder />
          <LoadingDocumentHolder />
          <DocumentHolder />
        </div>
        {fields.map((document, index) => (
          <section key={index}>
            <Label>{t(`documents.labels.${document.label}`)}</Label>
            <EmptyDocumentHolder />
          </section>
        ))}
        <div>
          <Button
            label={t('confirm')}
            extension="full"
            onClick={router.goBack}
          />
        </div>
      </div>
    )
  }
}

Documents.propTypes = {
  t: PropTypes.func.isRequired,
  router: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired
}

export default withRouter(translate()(Documents))
