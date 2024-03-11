import get from 'lodash/get'
import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router'

import { creditApplicationTemplate } from 'cozy-procedures'
import {
  Title,
  translate,
  Label,
  Input,
  Button
} from 'cozy-ui/transpiled/react/'

import ProcedureComponentsPropType from './ProcedureComponentsPropType'
import Topbar from './Topbar'

class Amount extends React.Component {
  render() {
    const {
      t,
      router,
      amount,
      updateAmount,
      components: { PageLayout, PageContent, PageFooter }
    } = this.props
    const min = get(creditApplicationTemplate, 'procedureData.amount.min')
    const max = get(creditApplicationTemplate, 'procedureData.amount.max')
    const defaultValue = get(
      creditApplicationTemplate,
      'procedureData.amount.default'
    )
    return (
      <PageLayout>
        <PageContent>
          <Topbar title={t('amount.title')} />
          <Title className="u-mb-2 u-ta-center">{t('amount.subtitle')}</Title>

          <div className="u-mb-1">
            <Label htmlFor="amount-input">{t('amount.label')}</Label>
            <Input
              type="number"
              id="amount-input"
              min={min}
              max={max}
              placeholder={defaultValue.toString()}
              value={amount === null ? '' : amount}
              onChange={e => updateAmount(parseInt(e.target.value))}
            />
          </div>
        </PageContent>
        <PageFooter>
          <Button
            label={t('confirm')}
            extension="full"
            onClick={router.goBack}
            disabled={amount === null}
          />
        </PageFooter>
      </PageLayout>
    )
  }
}

Amount.propTypes = {
  t: PropTypes.func.isRequired,
  router: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  amount: PropTypes.number,
  updateAmount: PropTypes.func.isRequired,
  components: ProcedureComponentsPropType.isRequired
}

export default withRouter(translate()(Amount))
