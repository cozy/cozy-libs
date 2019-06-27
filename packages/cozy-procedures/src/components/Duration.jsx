import React from 'react'
import PropTypes from 'prop-types'
import Topbar from './Topbar'
import { translate, Title, SubTitle, Label } from 'cozy-ui/transpiled/react'
import Card from 'cozy-ui/transpiled/react/Card'
import Slider from '@material-ui/lab/Slider'

class Duration extends React.Component {
  render() {
    const { t } = this.props
    return (
      <div>
        <Topbar title={t('duration.title')} />
        <Title>{t('duration.subtitle')}</Title>

        <Label>{t('duration.label')}</Label>
        <Card>
          <SubTitle>24 mois</SubTitle>
          <div>
            {t('duration.reimbursement')} : -25,83 {t('duration.unit')}
          </div>
          <div>{t('duration.rate')} : 3,390%</div>
        </Card>
        <Slider min={2} max={60} value={24} aria-label={t('duration.label')} />
      </div>
    )
  }
}

Duration.propTypes = {
  t: PropTypes.func.isRequired
}

export default translate()(Duration)
