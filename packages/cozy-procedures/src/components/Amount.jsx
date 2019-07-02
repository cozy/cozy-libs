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
  constructor(props) {
    super(props)
    this.confirm = this.confirm.bind(this)
    this.inputRef = React.createRef()
  }

  render() {
    const { t, amount, updateAmount } = this.props
    const min = get(creditApplicationTemplate, 'procedureData.amount.min')
    const max = get(creditApplicationTemplate, 'procedureData.amount.max')
    const defaultValue = get(
      creditApplicationTemplate,
      'procedureData.amount.default'
    )
    return (
      <div>
        <Topbar title={t('amount.title')} />
        <Title>{t('amount.subtitle')}</Title>

        <div className="u-mb-1">
          <Label htmlFor="amount-input">{t('amount.label')}</Label>
          <Input
            type="number"
            id="amount-input"
            min={min}
            max={max}
            value={amount === null ? defaultValue : amount}
            onChange={e => updateAmount(parseInt(e.target.value))}
            inputRef={this.inputRef}
          />
        </div>

        <div>
          <Button
            label={t('confirm')}
            extension="full"
            onClick={this.confirm}
          />
        </div>
      </div>
    )
  }

  confirm() {
    this.props.updateAmount(parseInt(this.inputRef.current.value))
    this.props.router.goBack()
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
