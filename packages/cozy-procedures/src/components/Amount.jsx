import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Topbar from './Topbar'
import {
  Title,
  translate,
  Label,
  Input,
  Button
} from 'cozy-ui/transpiled/react/'

class Amount extends React.Component {
  render() {
    const { t, router, amount, updateAmount } = this.props
    return (
      <div>
        <Topbar title={t('amount.title')} />
        <Title>{t('amount.subtitle')}</Title>

        <div>
          <Label htmlFor="amount-input">{t('amount.label')}</Label>
          <Input
            type="number"
            id="amount-input"
            value={amount}
            onChange={e => updateAmount(parseInt(e.target.value))}
          />
        </div>

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

Amount.propTypes = {
  t: PropTypes.func.isRequired,
  router: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  amount: PropTypes.number.isRequired,
  updateAmount: PropTypes.func.isRequired
}

export default withRouter(translate()(Amount))
