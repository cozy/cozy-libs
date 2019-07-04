import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import get from 'lodash/get'
import Topbar from './Topbar'
import {
  Title,
  translate,
  Label,
  Input,
  Button
} from 'cozy-ui/transpiled/react/'
import { creditApplicationTemplate } from 'cozy-procedures'

class Amount extends React.Component {
  render() {
    const { t, router, amount, updateAmount } = this.props
    const min = get(creditApplicationTemplate, 'procedureData.amount.min')
    const max = get(creditApplicationTemplate, 'procedureData.amount.max')
    const defaultValue = get(
      creditApplicationTemplate,
      'procedureData.amount.default'
    )
    return (
      <div>
        <Topbar title={t('amount.title')} />
        <Title className="u-mb-2 u-ta-center">{t('amount.subtitle')}</Title>

        <div className="u-mb-1">
          <Label htmlFor="amount-input">{t('amount.label')}</Label>
          <Input
            type="number"
            id="amount-input"
            min={min}
            max={max}
            placeholder={defaultValue}
            value={amount === null ? '' : amount}
            onChange={e => updateAmount(parseInt(e.target.value))}
          />
        </div>

        <div>
          <Button
            label={t('confirm')}
            extension="full"
            onClick={router.goBack}
            disabled={amount === null}
          />
        </div>
      </div>
    )
  }
}

Amount.propTypes = {
  t: PropTypes.func.isRequired,
  router: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  amount: PropTypes.number,
  updateAmount: PropTypes.func.isRequired
}

export default withRouter(translate()(Amount))
