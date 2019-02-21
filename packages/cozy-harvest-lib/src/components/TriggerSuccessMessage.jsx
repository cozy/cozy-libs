import once from 'lodash/once'
import React, { Component } from 'react'
import PropTypes from 'react-proptypes'

import Button from 'cozy-ui/react/Button'
import { translate } from 'cozy-ui/react/I18n'

import connectingImg from '../assets/images/connecting.svg'

const IDLE = 'idle'
const DONE = 'done'

export class TriggerSuccessMessage extends Component {
  state = {
    status: IDLE
  }

  constructor(props, context) {
    super(props, context)
    this.onClick = this.onClick.bind(this)
    this.onDone = once(props.onDone)
  }

  onClick() {
    const { status } = this.state
    if (status !== DONE) {
      this.onDone()
    }
    this.setState({ status: DONE })
  }

  render() {
    const { t } = this.props
    const { status } = this.state
    const isDone = status === DONE
    return (
      <div className="u-ta-center">
        <img alt={t('triggerSuccessMessage.figure.alt')} src={connectingImg} />
        <h2>{t('triggerSuccessMessage.title')}</h2>
        <p className="u-ta-left">{t('triggerSuccessMessage.description')}</p>
        <Button
          disabled={isDone}
          label={t('triggerSuccessMessage.button.label')}
          onClick={this.onClick}
        />
      </div>
    )
  }
}

TriggerSuccessMessage.propTypes = {
  onDone: PropTypes.func.isRequired
}

export default translate()(TriggerSuccessMessage)
