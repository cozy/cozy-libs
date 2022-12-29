import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-text-to-clipboard'
import { models } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Button from 'cozy-ui/transpiled/react/Button'
import CompositeRow from 'cozy-ui/transpiled/react/CompositeRow'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Radio from 'cozy-ui/transpiled/react/Radio'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import get from 'lodash/get'
import logger from '../logger'
import styles from '../share.styl'

import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'

import Typography from 'cozy-ui/transpiled/react/Typography'

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

const ShareByLink = ({
  link,
  documentType,
  document,
  permissions,
  onChangePermissions,
  onEnable,
  onDisable,
  checked,
  popperOptions
}) => {
  const { t } = useI18n()
  const [loading, setLoading] = useState(false)
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const containerRef = useRef()

  const copyLinkToClipboard = ({ isAutomaticCopy }) => {
    if (copy(link))
      Alerter.success(t(`${documentType}.share.shareByLink.copied`))
    else if (!isAutomaticCopy)
      // In case of automatic copy, the browser can block the copy request. This is not shown to the user since it is expected and can be circumvented by clicking directly on the copy link
      Alerter.error(t(`${documentType}.share.shareByLink.failed`))
  }

  const createShareLink = async () => {
    try {
      setLoading(true)
      await onEnable(document)
    } catch (e) {
      Alerter.error(t(`${documentType}.share.error.generic`))
      logger.log(e)
    } finally {
      setLoading(false)
    }
  }

  const deleteShareLink = async () => {
    try {
      setLoading(true)
      await onDisable(document)
    } catch (e) {
      Alerter.error(t(`${documentType}.share.error.revoke`))
      logger.log(e)
    } finally {
      setLoading(false)
    }
  }

  const updateLinkPermissions = ({ isReadOnly }) => {
    const verbs = isReadOnly ? ['GET'] : ['GET', 'POST', 'PUT', 'PATCH']
    try {
      onChangePermissions(document, verbs)
    } catch (err) {
      Alerter.error(t(`${documentType}.share.shareByLink.permserror`))
      logger.log(err)
    }
  }

  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen)
  }

  const hasReadOnlyPermissions = checkIsReadOnlyPermissions(permissions)

  return (
    <div className="u-w-100">
      <div className="u-flex u-flex-row u-flex-justify-between u-flex-items-center">
        <Typography variant="body1">
          {t(`${documentType}.share.shareByLink.subtitle`)}
        </Typography>
        {!checked && (
          <Button
            style={{ position: 'initial' }} // fix z-index bug on iOS when under a BottomDrawer due to relative position
            theme="text"
            className={styles['aligned-dropdown-button']}
            onClick={async () => {
              await createShareLink()
              copyLinkToClipboard({ isAutomaticCopy: true })
            }}
            busy={loading}
            label={t(`${documentType}.share.shareByLink.create`)}
          />
        )}
      </div>
      {checked && (
        <CompositeRow
          className="u-ph-0"
          primaryText={
            <Typography
              onClick={copyLinkToClipboard}
              className="u-c-pointer"
              variant="body1"
            >
              {t(`${documentType}.share.shareByLink.activated`)}
            </Typography>
          }
          secondaryText={
            <Typography
              className="u-primaryColor u-fz-tiny u-c-pointer"
              onClick={copyLinkToClipboard}
              variant="body1"
            >
              {t(`${documentType}.share.shareByLink.copy`)}
            </Typography>
          }
          image={
            <Circle backgroundColor="var(--silver)">
              <Icon icon={LinkIcon} color="var(--charcoalGrey)" />
            </Circle>
          }
          right={
            <div ref={containerRef}>
              <DropdownButton onClick={toggleMenu}>
                <Typography variant="body1">
                  {t(
                    `${documentType}.share.shareByLink.${
                      hasReadOnlyPermissions ? 'ro' : 'rw'
                    }`
                  )}
                </Typography>
              </DropdownButton>
              {menuIsOpen && (
                <ActionMenu
                  onClose={toggleMenu}
                  popperOptions={{
                    ...popperOptions,
                    placement: 'bottom-end'
                  }}
                  containerElRef={containerRef}
                  anchorElRef={containerRef}
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
                      toggleMenu()
                      updateLinkPermissions({ isReadOnly: true })
                    }}
                  >
                    <>
                      {t(`${documentType}.share.shareByLink.ro`)}
                      <Typography
                        className="u-mt-half"
                        variant="caption"
                        color="textSecondary"
                      >
                        {t(`${documentType}.share.shareByLink.desc.ro`)}
                      </Typography>
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
                      toggleMenu()
                      updateLinkPermissions({ isReadOnly: false })
                    }}
                  >
                    <>
                      {t(`${documentType}.share.shareByLink.rw`)}
                      <Typography
                        className="u-mt-half"
                        variant="caption"
                        color="textSecondary"
                      >
                        {t(`${documentType}.share.shareByLink.desc.rw`)}
                      </Typography>
                    </>
                  </ActionMenuItem>
                  <hr />
                  <ActionMenuItem
                    left={<Icon icon={TrashIcon} color="var(--errorColor)" />}
                    onClick={() => {
                      toggleMenu()
                      deleteShareLink()
                    }}
                  >
                    <Typography className="u-error" variant="body1">
                      {t(`${documentType}.share.shareByLink.deactivate`)}
                    </Typography>
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
