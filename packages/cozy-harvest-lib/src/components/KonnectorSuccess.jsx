import has from 'lodash/has'
import sortBy from 'lodash/sortBy'
import get from 'lodash/get'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import { ModalContent } from 'cozy-ui/transpiled/react/Modal'

import Button from 'cozy-ui/react/Button'
import withLocales from './hoc/withLocales'
import DriveLink from '../components/KonnectorConfiguration/Success/DriveLink'
import BanksLink from '../components/KonnectorConfiguration/Success/BanksLink'
import connectingIllu from '../assets/connecting-data-in-progress.svg'
import Markdown from './Markdown'

const SuccessImage = () => <img src={connectingIllu} className="u-w-4 u-h-4" />

const DescriptionContent = ({ title, message, children }) => {
  return (
    <>
      <h4>{title}</h4>
      <Markdown source={message} />
      {children}
    </>
  )
}

export class KonnectorSuccess extends Component {
  state = {
    trigger: null
  }
  componentDidMount() {
    const { accountId, accounts } = this.props
    const matchingTrigger = get(
      accounts.find(account => account.account._id === accountId),
      'trigger'
    )
    this.setState({ trigger: matchingTrigger })
  }
  render() {
    const { t } = this.props
    const relatedApps = sortBy(
      Object.values(KonnectorSuccess.apps).filter(app =>
        app.predicate(this.state, this.props)
      ),
      app => -app.priority
    )

    const hasLinks = relatedApps.length > 0

    return (
      <ModalContent>
        <div className="u-ta-center">
          <SuccessImage />
          <DescriptionContent
            title={t('account.success.title')}
            message={t('account.success.connect')}
          >
            {hasLinks && (
              <p className="u-mv-half">
                {relatedApps.map((app, i) =>
                  // Should always pass context, since it's used for customisation
                  app.successLink(this.state, this.props, this.context, i)
                )}
              </p>
            )}
          </DescriptionContent>

          <>
            {relatedApps.length > 0
              ? // Should always pass context, since it's used for customisation
                relatedApps[0].footerLink(this.state, this.props, this.context)
              : null}
          </>
        </div>
      </ModalContent>
    )
  }
}

KonnectorSuccess.apps = {
  drive: {
    priority: 0,
    // eslint-disable-next-line react/display-name
    predicate: state => {
      const trigger = state.trigger
      const res = has(trigger, 'message.folder_to_save')
      return res
    },
    // eslint-disable-next-line react/display-name
    successLink: (state, props, context, i) => {
      return (
        <DriveLink key={i} folderId={state.trigger.message.folder_to_save} />
      )
    },
    // eslint-disable-next-line react/display-name
    footerLink: (state, props) => {
      const { t, successButtonLabel } = props
      return (
        <Button
          label={successButtonLabel || t('account.success.button')}
          onClick={event => {
            event.preventDefault()
            props.onDismiss()
          }}
        />
      )
    }
  },

  banks: {
    priority: 1,
    // eslint-disable-next-line react/display-name
    predicate: (state, props) => {
      const konnector = props.konnector
      return (
        Array.isArray(konnector.data_types) &&
        konnector.data_types.includes('bankAccounts')
      )
    },
    // eslint-disable-next-line react/display-name
    successLink: (state, props, context, i) => {
      return <BanksLink key={i} />
    },
    footerLink: () => null
  }
}

KonnectorSuccess.propTypes = {
  accountId: PropTypes.string.isRequired,
  accounts: PropTypes.array.isRequired,
  successButtonLabel: PropTypes.string,
  konnector: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired
}

export { SuccessImage, BanksLink, DriveLink }

export default withRouter(withLocales(KonnectorSuccess))
