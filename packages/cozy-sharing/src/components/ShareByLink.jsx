import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-text-to-clipboard'
import { models } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Text, { Caption } from 'cozy-ui/transpiled/react/Text'
import Button from 'cozy-ui/transpiled/react/Button'
import CompositeRow from 'cozy-ui/transpiled/react/CompositeRow'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Radio from 'cozy-ui/transpiled/react/Radio'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import get from 'lodash/get'
import logger from '../logger'
import styles from '../share.styl'

import palette from 'cozy-ui/transpiled/react/palette'

const permissionModel = models.permission

const checkIsReadOnlyPermissions = permissions => {
  const permissionCategories = get(
    permissions,
    '[0].attributes.permissions',
    {}
  )
  return (
    Object.values(permissionCategories).filter(permissionCategory =>
      permissionModel.isReadOnly(permissionCategory)
    ).length > 0
  )
}

class ShareByLink extends React.Component {
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

  copyLinkToClipboard = ({ isAutomaticCopy }) => {
    if (copy(this.props.link))
      Alerter.success(
        this.props.t(`${this.props.documentType}.share.shareByLink.copied`)
      )
    else if (!isAutomaticCopy)
      // In case of automatic copy, the browser can block the copy request. This is not shown to the user since it is expected and can be circumvented by clicking directly on the copy link
      Alerter.error(
        this.props.t(`${this.props.documentType}.share.shareByLink.failed`)
      )
  }

  async createShareLink() {
    try {
      this.setState(state => ({ ...state, loading: true }))
      await this.props.onEnable(this.props.document)
    } catch (e) {
      Alerter.error(
        this.props.t(`${this.props.documentType}.share.error.generic`)
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
        this.props.t(`${this.props.documentType}.share.error.revoke`)
      )
      logger.log(e)
    } finally {
      this.setState(state => ({ ...state, loading: false }))
    }
  }

  updateLinkPermissions({ isReadOnly }) {
    const { document, documentType, onChangePermissions, t } = this.props
    const verbs = isReadOnly ? ['GET'] : ['GET', 'POST', 'PUT', 'PATCH']
    try {
      onChangePermissions(document, verbs)
    } catch (err) {
      Alerter.error(t(`${documentType}.share.shareByLink.permserror`))
      logger.log(err)
    }
  }

  toggleMenu = () => {
    this.setState(state => ({ ...state, menuIsOpen: !state.menuIsOpen }))
  }

  render() {
    const { loading, menuIsOpen } = this.state
    const { checked, documentType, permissions, t } = this.props

    const hasReadOnlyPermissions = checkIsReadOnlyPermissions(permissions)

    return (
      <div className="u-w-100 u-pt-half">
        <div className="u-flex u-flex-row u-flex-justify-between u-flex-items-center">
          <Text>{t(`${documentType}.share.shareByLink.subtitle`)}</Text>
          {!checked && (
            <Button
              theme="text"
              className={styles['aligned-dropdown-button']}
              onClick={async () => {
                await this.createShareLink()
                this.copyLinkToClipboard({ isAutomaticCopy: true })
              }}
              busy={loading}
              label={t(`${documentType}.share.shareByLink.create`)}
            />
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
              <div ref={this.containerRef}>
                <DropdownButton onClick={this.toggleMenu}>
                  <Text>
                    {t(
                      `${documentType}.share.shareByLink.${
                        hasReadOnlyPermissions ? 'ro' : 'rw'
                      }`
                    )}
                  </Text>
                </DropdownButton>
                {menuIsOpen && (
                  <ActionMenu
                    onClose={this.toggleMenu}
                    placement="bottom-end"
                    containerElRef={this.containerRef}
                    anchorElRef={this.containerRef}
                  >
                    <ActionMenuItem
                      left={
                        <Radio
                          name="permissions"
                          value="ro"
                          className="u-w-1 u-h-1"
                          checked={hasReadOnlyPermissions}
                          readOnly
                        />
                      }
                      onClick={() => {
                        this.toggleMenu()
                        this.updateLinkPermissions({ isReadOnly: true })
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
                          checked={!hasReadOnlyPermissions}
                          readOnly
                        />
                      }
                      onClick={() => {
                        this.toggleMenu()
                        this.updateLinkPermissions({ isReadOnly: false })
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

export default translate()(ShareByLink)
