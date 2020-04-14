import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-text-to-clipboard'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Text, { Caption } from 'cozy-ui/transpiled/react/Text'
import Button from 'cozy-ui/transpiled/react/Button'
import CompositeRow from 'cozy-ui/transpiled/react/CompositeRow'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Radio from 'cozy-ui/transpiled/react/Radio'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import get from 'lodash/get'
import logger from '../logger'

import palette from 'cozy-ui/transpiled/react/palette'

class ShareByLink extends React.Component {
  static contextTypes = {
    t: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      menuIsOpen: false
    }

    this.containerRef = React.createRef()
  }

  toggleShareLink = checked => {
    if (checked) {
      this.createShareLink()
    } else {
      this.deleteShareLink()
    }
  }

  copyLinkToClipboard = () => {
    if (copy(this.props.link))
      Alerter.success(
        this.context.t(`${this.props.documentType}.share.shareByLink.copied`)
      )
    else
      Alerter.error(
        this.context.t(`${this.props.documentType}.share.shareByLink.failed`)
      )
  }

  async createShareLink() {
    try {
      this.setState(state => ({ ...state, loading: true }))
      await this.props.onEnable(this.props.document)
    } catch (e) {
      Alerter.error(
        this.context.t(`${this.props.documentType}.share.error.generic`)
      )
      logger.log(e)
    } finally {
      this.setState(state => ({ ...state, loading: false }))
    }
  }

  async deleteShareLink() {
    try {
      this.setState(state => ({ ...state, loading: true }))
      await this.props.onDisable(this.props.document)
    } catch (e) {
      Alerter.error(
        this.context.t(`${this.props.documentType}.share.error.revoke`)
      )
      logger.log(e)
    } finally {
      this.setState(state => ({ ...state, loading: false }))
    }
  }

  toggleMenu = () => {
    this.setState(state => ({ ...state, menuIsOpen: !state.menuIsOpen }))
  }

  render() {
    const t = this.context.t
    const { loading, menuIsOpen } = this.state
    const {
      checked,
      document,
      documentType,
      permissions,
      onChangePermissions
    } = this.props
    const permissionCategories = get(
      permissions,
      '[0].attributes.permissions',
      {}
    )
    const hasWritePermissions =
      Object.values(permissionCategories).filter(permissionCategory =>
        get(permissionCategory, 'verbs', []).includes('POST')
      ).length > 0

    return (
      <div ref={this.containerRef}>
        <div className="u-flex u-flex-row u-flex-justify-between u-flex-items-center">
          <Text>{t(`${documentType}.share.shareByLink.subtitle`)}</Text>
          {!checked && (
            <Button
              theme="text"
              onClick={async () => {
                await this.createShareLink()
                this.copyLinkToClipboard()
              }}
              busy={loading}
            >
              {t(`${documentType}.share.shareByLink.create`)}
            </Button>
          )}
        </div>
        {checked && (
          <CompositeRow
            className={'u-ph-0'}
            primaryText={
              <Text onClick={this.copyLinkToClipboard} className="u-c-pointer">
                {t(`${documentType}.share.shareByLink.activated`)}
              </Text>
            }
            secondaryText={
              <Text
                className="u-primaryColor u-fz-tiny u-c-pointer"
                onClick={this.copyLinkToClipboard}
              >
                {t(`${documentType}.share.shareByLink.copy`)}
              </Text>
            }
            image={
              <Circle backgroundColor="var(--silver)">
                <Icon icon="link" color="var(--charcoalGrey)" />
              </Circle>
            }
            right={
              <div>
                <DropdownButton onClick={this.toggleMenu}>
                  <Text>
                    {t(
                      `${documentType}.share.shareByLink.${
                        hasWritePermissions ? 'rw' : 'ro'
                      }`
                    )}
                  </Text>
                </DropdownButton>
                {menuIsOpen && (
                  <ActionMenu
                    onClose={this.toggleMenu}
                    placement="bottom-end"
                    containerElRef={this.containerRef}
                  >
                    <ActionMenuItem
                      left={
                        <Radio
                          name="permissions"
                          value="ro"
                          className="u-w-1 u-h-1"
                          checked={!hasWritePermissions}
                          readOnly
                        />
                      }
                      onClick={() => {
                        this.toggleMenu()
                        onChangePermissions(document, ['GET'])
                      }}
                    >
                      <>
                        {t(`${documentType}.share.shareByLink.ro`)}
                        <Caption className="u-mt-half">
                          {t(`${documentType}.share.shareByLink.desc.ro`)}
                        </Caption>
                      </>
                    </ActionMenuItem>
                    <ActionMenuItem
                      left={
                        <Radio
                          name="permissions"
                          value="rw"
                          className="u-w-1 u-h-1"
                          checked={hasWritePermissions}
                          readOnly
                        />
                      }
                      onClick={() => {
                        this.toggleMenu()
                        onChangePermissions(document, [
                          'GET',
                          'POST',
                          'PUT',
                          'PATCH'
                        ])
                      }}
                    >
                      <>
                        {t(`${documentType}.share.shareByLink.rw`)}
                        <Caption className="u-mt-half">
                          {t(`${documentType}.share.shareByLink.desc.rw`)}
                        </Caption>
                      </>
                    </ActionMenuItem>
                    <hr />
                    <ActionMenuItem
                      left={<Icon icon="trash" color={palette.pomegranate} />}
                      onClick={() => {
                        this.toggleMenu()
                        this.deleteShareLink()
                      }}
                    >
                      <Text className="u-pomegranate">
                        {t(`${documentType}.share.shareByLink.deactivate`)}
                      </Text>
                    </ActionMenuItem>
                  </ActionMenu>
                )}
              </div>
            }
          />
        )}
      </div>
    )
  }
}

ShareByLink.propTypes = {
  permissions: PropTypes.array.isRequired,
  checked: PropTypes.bool.isRequired,
  documentType: PropTypes.string.isRequired,
  document: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
  onEnable: PropTypes.func.isRequired,
  onDisable: PropTypes.func.isRequired
}

export default ShareByLink
