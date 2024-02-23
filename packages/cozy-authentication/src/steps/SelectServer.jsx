/* global __ALLOW_HTTP__ */
import classNames from 'classnames'
import isUrl from 'is-url'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'

import 'cozy-ui/assets/icons/ui/lock.svg'
import 'cozy-ui/assets/icons/ui/next.svg'
import 'cozy-ui/assets/icons/ui/previous.svg'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LockIcon from 'cozy-ui/transpiled/react/Icons/Lock'
import NextIcon from 'cozy-ui/transpiled/react/Icons/Next'
import Label from 'cozy-ui/transpiled/react/Label'
import {
  Wizard,
  WizardMain,
  WizardPreviousButton,
  WizardNextButton,
  WizardHeader,
  WizardWrapper,
  WizardTitle,
  WizardSelect,
  WizardFooter,
  WizardDualField,
  WizardNotice,
  WizardErrors,
  WizardProtocol,
  WizardDualFieldWrapper,
  WizardDualFieldInput
} from 'cozy-ui/transpiled/react/Wizard'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import ButtonLinkRegistration from './ButtonLinkRegistration'

require('url-polyfill')

const ERR_WRONG_ADDRESS = 'mobile.onboarding.server_selection.wrong_address'
const ERR_EMAIL = 'mobile.onboarding.server_selection.wrong_address_with_email'
const ERR_V2 = 'mobile.onboarding.server_selection.wrong_address_v2'
const ERR_COSY = 'mobile.onboarding.server_selection.wrong_address_cosy'

const customValue = 'custom'
const cozyDomain = '.mycozy.cloud'

export class SelectServer extends Component {
  state = {
    value: '',
    fetching: false,
    error: null,
    selectValue: cozyDomain,
    isCustomDomain: false,
    placeholderValue:
      'mobile.onboarding.server_selection.cozy_address_placeholder'
  }

  componentDidMount() {
    // if the cordova plugin is here, then shrink the view on iOS
    if (window.Keyboard && window.Keyboard.shrinkView) {
      window.Keyboard.shrinkView(true)
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        'Cozy-Authentication needs a cozy/cordova-plugin-keyboard plugin to work better.'
      )
    }
  }
  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
    const error =
      nextProps.externalError &&
      nextProps.externalError.message !== 'REGISTRATION_ABORT'
        ? ERR_WRONG_ADDRESS
        : null
    this.setState(state => ({
      ...state,
      error,
      fetching: nextProps.fetching
    }))
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.error && this.state.error !== prevState.error) {
      this.input.focus()
      this.input.select()
    }
  }

  onChange(value) {
    if (!this.state.manuallySelected) {
      if (value.startsWith('www.') && (value.match(/\./g) || []).length === 1) {
        this.setState({
          selectValue: cozyDomain
        })
      } else {
        if (value.includes('.')) {
          this.setState({
            selectValue: customValue,
            isCustomDomain: true
          })
        } else {
          this.setState({
            selectValue: cozyDomain,
            isCustomDomain: false
          })
        }
      }
    }
    if (this.state.error) {
      this.setState(state => ({ ...state, error: null }))
    }
    this.setState(state => ({ ...state, value: value.trim() }))
  }

  onSubmit = async e => {
    e.preventDefault()
    const value = this.state.value
    let error

    if (this.hasAtSign(value)) {
      error = ERR_EMAIL
    }
    if (this.hasMispelledCozy(value)) {
      error = ERR_COSY
    }

    const url = this.getUrl(value)
    if (
      url === '' ||
      // eslint-disable-next-line
      (/^http:/.test(url) && typeof __ALLOW_HTTP__ === undefined)
    ) {
      error = ERR_WRONG_ADDRESS
    }
    if (error) {
      this.setState(state => ({ ...state, error }))
      this.props.onException(new Error(error), {
        tentativeUrl: value,
        onboardingStep: 'validating URL'
      })
      return false
    }

    this.setState(state => ({ ...state, fetching: true }))

    if (await this.isV2URL(url)) {
      this.setState(state => ({
        ...state,
        error: ERR_V2,
        fetching: false
      }))
    }

    this.props.nextStep(url)
  }

  isV2URL = async url => {
    const { client } = this.context
    try {
      if (client.isV2) {
        return await client.isV2(url)
      } else {
        return false
      }
    } catch (err) {
      this.props.onException(err, {
        tentativeUrl: url,
        onboardingStep: 'checking is V2 URL'
      })
      // this can happen if the HTTP request to check the instance version fails; in that case, it is likely to fail again and be caught during the authorize process, which is designedto handle this
      return false
    }
  }

  isValideCozyName = value => {
    return (
      /^[a-zA-Z0-9-]*$/.test(value) && value.length > 0 && value.length < 63
    )
  }
  hasMispelledCozy = value => /\..*cosy.*\./.test(value)
  hasAtSign = value => /.*@.*/.test(value)

  appendDomain = (value, domain) =>
    /\./.test(value) ? value : `${value}${domain}`
  prependProtocol = value =>
    /^http(s)?:\/\//.test(value) ? value : `https://${value}`
  removeAppSlug = value => {
    const matchedSlugs = /^https?:\/\/\w+(-\w+)\./gi.exec(value)

    return matchedSlugs ? value.replace(matchedSlugs[1], '') : value
  }
  normalizeURL = (value, defaultDomain) => {
    const valueWithProtocol = this.prependProtocol(value)
    const valueWithProtocolAndDomain = this.appendDomain(
      valueWithProtocol,
      defaultDomain
    )

    const isDefaultDomain = new RegExp(`${defaultDomain}$`).test(
      valueWithProtocolAndDomain
    )

    return isDefaultDomain
      ? this.removeAppSlug(valueWithProtocolAndDomain)
      : valueWithProtocolAndDomain
  }

  getUrl = value => {
    try {
      const defaultDomain = cozyDomain
      const normalizedURL = this.normalizeURL(value, defaultDomain)

      return new URL(normalizedURL).toString().replace(/\/$/, '')
    } catch (err) {
      return ''
    }
  }

  getSubDomain = value => {
    if (value.includes('.')) {
      return value.substr(0, value.indexOf('.'))
    }
    return value
  }
  selectOnChange = e => {
    this.setState({
      selectValue: e.target.value,
      isCustomDomain: e.target.value === customValue ? true : false,
      manuallySelected: e.target.value === customValue ? true : false,
      value:
        e.target.value !== customValue
          ? this.getSubDomain(this.state.value)
          : this.state.value,
      placeholderValue:
        e.target.value === customValue
          ? 'mobile.onboarding.server_selection.cozy_custom_address_placeholder'
          : 'mobile.onboarding.server_selection.cozy_address_placeholder'
    })
    this.input.focus()
  }

  render() {
    const { value, error, fetching, isCustomDomain, placeholderValue } =
      this.state
    const {
      t,
      previousStep,
      breakpoints: { isTiny },
      onboarding
    } = this.props
    const inputID = 'inputID'
    return (
      <Wizard tag="form" onSubmit={this.onSubmit}>
        <WizardWrapper>
          <WizardHeader>
            <WizardPreviousButton
              subtle
              icon="previous"
              iconOnly
              extension="narrow"
              onClick={previousStep}
              type="button"
              label={t('mobile.onboarding.server_selection.previous')}
            />
            <WizardTitle>
              {t('mobile.onboarding.server_selection.title')}
            </WizardTitle>
          </WizardHeader>
          <WizardMain>
            <Label htmlFor={inputID}>
              {t('mobile.onboarding.server_selection.label')}
            </Label>
            <WizardDualField
              hasFocus={this.state.dualFieldHasFocus}
              hasError={error}
            >
              {!isTiny && (
                <WizardProtocol>
                  <Icon icon={LockIcon} />
                  <span>https://</span>
                </WizardProtocol>
              )}
              <WizardDualFieldWrapper>
                <WizardDualFieldInput
                  type="text"
                  id={inputID}
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="off"
                  autoFocus
                  placeholder={t(placeholderValue)}
                  size={isTiny ? 'medium' : undefined}
                  inputRef={input => {
                    this.input = input
                  }}
                  onChange={({ target: { value } }) => {
                    this.onChange(value)
                  }}
                  onFocus={() =>
                    this.setState({
                      dualFieldHasFocus: true
                    })
                  }
                  onBlur={() => this.setState({ dualFieldHasFocus: false })}
                  value={value}
                />
              </WizardDualFieldWrapper>
              <WizardSelect
                narrow={isCustomDomain}
                medium={isTiny}
                value={this.state.selectValue}
                onChange={e => {
                  this.selectOnChange(e)
                }}
              >
                <option value=".mycozy.cloud">
                  {t('mobile.onboarding.server_selection.domain_cozy')}
                </option>
                <option value="custom">
                  {t('mobile.onboarding.server_selection.domain_custom')}
                </option>
              </WizardSelect>
            </WizardDualField>
            <WizardNotice
              tag={ReactMarkdown}
              variant="lost"
              source={t('mobile.onboarding.server_selection.lostpwd')}
            />
            {error && <WizardErrors tag={ReactMarkdown} source={t(error)} />}
          </WizardMain>
          <WizardFooter className={isTiny ? 'u-mt-auto' : 'u-pb-2'}>
            <WizardNextButton
              disabled={Boolean(
                error ||
                  fetching ||
                  (isCustomDomain && !isUrl(this.prependProtocol(value))) ||
                  (!isCustomDomain && !this.isValideCozyName(value))
              )}
              busy={fetching}
              label={t('mobile.onboarding.server_selection.button')}
              size={isTiny ? 'normal' : 'large'}
            >
              {!fetching && <Icon icon={NextIcon} color="white" />}
            </WizardNextButton>
            <ButtonLinkRegistration
              className={classNames('wizard-buttonlink')}
              label={t('mobile.onboarding.welcome.no_account_link')}
              size={isTiny ? 'normal' : 'large'}
              subtle={true}
              type="button"
              theme="text"
              onboarding={onboarding}
            />
          </WizardFooter>
        </WizardWrapper>
      </Wizard>
    )
  }
}

SelectServer.propTypes = {
  t: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  fetching: PropTypes.bool,
  externalError: PropTypes.object,
  onException: PropTypes.func.isRequired
}

SelectServer.defaultProps = {
  fetching: false,
  externalError: null
}

SelectServer.contextTypes = {
  client: PropTypes.object
}

export default withBreakpoints()(translate()(SelectServer))
