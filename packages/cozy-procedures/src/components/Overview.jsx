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
import InlineCard from 'cozy-ui/transpiled/react/InlineCard'

class Overview extends React.Component {
  navigateTo = view => {
    const { location, router } = this.props
    const rootPath = location.pathname
    const separator = rootPath.endsWith('/') ? '' : '/'
    router.push(`${rootPath}${separator}${view}`)
  }

  render() {
    const {
      personalDataFieldsCompleted,
      personalDataFieldsTotal,
      amount,
      duration,
      t
    } = this.props
    return (
      <div>
        <Topbar title={creditApplicationTemplate.name} />
        <Title className="u-mb-2">{t('overview.subtitle')}</Title>
        <section className="u-mb-2">
          <SubTitle className="u-mb-1">{t('overview.request')}</SubTitle>
          <div className="u-flex u-flex-items-center">
            {amount !== null ? (
              <InlineCard>
                {t('overview.amountUnit', { smart_count: amount })}
              </InlineCard>
            ) : (
              <Button
                label={t('overview.amount')}
                theme="ghost"
                onClick={() => this.navigateTo('amount')}
              />
            )}
            <span className="u-ph-half">{t('overview.over')}</span>
            {duration !== null ? (
              <InlineCard>
                {t('overview.durationUnit', { smart_count: duration })}
              </InlineCard>
            ) : (
              <Button
                label={t('overview.duration')}
                theme="ghost"
                onClick={() => this.navigateTo('duration')}
              />
            )}
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
          <SubTitle className="u-mb-1">{t('overview.personalData')}</SubTitle>
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
  personalDataFieldsCompleted: PropTypes.number,
  personalDataFieldsTotal: PropTypes.number,
  duration: PropTypes.number,
  amount: PropTypes.number,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  t: PropTypes.func.isRequired
}

Overview.defaultProps = {
  personalDataFieldsCompleted: 0,
  personalDataFieldsTotal: 0,
  location: {
    pathname: '/'
  }
}

export default translate()(withRouter(Overview))
