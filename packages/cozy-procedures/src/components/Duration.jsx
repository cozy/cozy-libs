import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Topbar from './Topbar'
import {
  translate,
  Title,
  SubTitle,
  Label,
  Button,
  Card
} from 'cozy-ui/transpiled/react'
import Slider from '@material-ui/lab/Slider'
import { withRouter } from 'react-router'
import creditApplicationTemplate from '../templates/creditApplicationTemplate'

class Duration extends React.PureComponent {
  render() {
    const { t, router, duration, amount, updateDuration } = this.props

    const min = get(creditApplicationTemplate, 'procedureData.duration.min')
    const max = get(creditApplicationTemplate, 'procedureData.duration.max')
    const defaultDuration = get(
      creditApplicationTemplate,
      'procedureData.duration.default'
    )
    const defaultAmount = get(
      creditApplicationTemplate,
      'procedureData.amount.default'
    )

    const simulationDuration = duration || defaultDuration
    const simulationAmount = amount || defaultAmount

    const rate = 3.2 + (simulationDuration * 0.2) / 60
    const actualRate = rate / 100 / simulationDuration
    const installment =
      (actualRate / (1 - Math.pow(1 + actualRate, -simulationDuration))) *
      simulationAmount
    return (
      <div>
        <Topbar title={t('duration.title')} />
        <Title>{t('duration.subtitle')}</Title>

        <Label>{t('duration.label')}</Label>
        <Card>
          <SubTitle>
            {simulationDuration} {t('duration.month')}
          </SubTitle>
          <div>
            {t('duration.reimbursement')} : {installment.toFixed(2)}{' '}
            {t('duration.unit')}
          </div>
          <div>
            {t('duration.rate')} : {rate.toFixed(2)}%
          </div>
        </Card>
        <Slider
          min={min}
          max={max}
          value={simulationDuration}
          aria-label={t('duration.label')}
          onChange={(event, value) => updateDuration(value)}
        />
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

Duration.propTypes = {
  t: PropTypes.func.isRequired,
  router: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  duration: PropTypes.number,
  amount: PropTypes.number,
  updateDuration: PropTypes.func.isRequired
}

export default withRouter(translate()(Duration))
