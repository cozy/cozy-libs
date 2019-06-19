import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Topbar from './Topbar'
import creditApplicationTemplate from '../templates/creditApplicationTemplate'
import {
  Title,
  SubTitle,
  Caption,
  Button,
  translate
} from 'cozy-ui/transpiled/react'

class Overview extends React.Component {
  navigateTo = view => {
    const { location, router } = this.props
    const rootPath = location.pathname
    const separator = rootPath.endsWith('/') ? '' : '/'
    router.push(`${rootPath}${separator}${view}`)
  }

  render() {
    const { personalData, t } = this.props

    const personalDataFieldsTotal = Object.keys(personalData).length
    const personalDataFieldsCompleted = Object.values(personalData).filter(
      Boolean
    ).length

    return (
      <div>
        <Topbar title={creditApplicationTemplate.name} />
        <Title className="u-mb-2">{t('overview.subtitle')}</Title>
        <section className="u-mb-2">
          <SubTitle className="u-mb-1">{t('overview.request')}</SubTitle>
          <div className="u-flex u-flex-items-center">
            <Button
              label={t('overview.amount')}
              theme="ghost"
              onClick={() => this.navigateTo('amount')}
            />
            {t('overview.over')}
            <Button
              label={t('overview.duration')}
              theme="ghost"
              onClick={() => this.navigateTo('duration')}
            />
          </div>
        </section>
        <section className="u-mb-2">
          <SubTitle className="u-mb-1">{t('overview.documents')}</SubTitle>
          <Button
            label={t('overview.complete')}
            extraRight={'0/0'}
            onClick={() => this.navigateTo('documents')}
            theme="ghost"
            extension="full"
            icon="pen"
          />
        </section>
        <section className="u-mb-2">
          <SubTitle className="u-mb-1">{t('overview.infos')}</SubTitle>
          <Button
            label={t('overview.complete')}
            extraRight={`${personalDataFieldsCompleted}/${personalDataFieldsTotal}`}
            onClick={() => this.navigateTo('personal')}
            theme="ghost"
            extension="full"
            icon="pen"
          />
        </section>
        <Caption className="u-mb-1">{t('overview.notice')}</Caption>
        <Button label={t('overview.button')} extension="full" />
      </div>
    )
  }
}

Overview.propTypes = {
  personalData: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  t: PropTypes.func.isRequired
}

Overview.defaultProps = {
  personalData: {},
  location: {
    pathname: '/'
  }
}

export default translate()(withRouter(Overview))
