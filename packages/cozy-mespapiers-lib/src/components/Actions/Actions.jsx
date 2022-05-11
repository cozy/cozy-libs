import React from 'react'
import { useHistory } from 'react-router-dom'
import cx from 'classnames'

import { generateWebLink, isReferencedBy } from 'cozy-client'
import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Link from 'cozy-ui/transpiled/react/Link'

import { CONTACTS_DOCTYPE } from '../../doctypes'
import DeleteConfirm from './DeleteConfirm'
import { downloadFiles, forwardFile } from './utils'

const useStyles = makeStyles(theme => ({
  disabledItem: {
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'initial'
    }
  },
  disabledIcon: {
    fill: theme.palette.text.disabled
  },
  disabledTypography: {
    color: theme.palette.text.disabled
  }
}))

const ActionMenuItemWrapper = ({
  icon,
  children,
  className = '',
  onClick = undefined,
  isEnabled = true,
  iconProps = {},
  typographyProps = {}
}) => {
  const styles = useStyles()

  return (
    <ActionMenuItem
      onClick={onClick}
      className={cx(`u-flex-items-center ${className}`, {
        [styles.disabledItem]: !isEnabled
      })}
      left={
        <Icon
          icon={icon}
          className={cx({
            [styles.disabledIcon]: !isEnabled
          })}
          {...iconProps}
        />
      }
    >
      <Typography
        className={cx({
          [styles.disabledTypography]: !isEnabled
        })}
        variant="body1"
        {...typographyProps}
      >
        {children}
      </Typography>
    </ActionMenuItem>
  )
}

export const hr = () => {
  return {
    name: 'hr',
    displayInSelectionBar: false,
    Component: function hr() {
      return <hr />
    }
  }
}

export const open = () => {
  return {
    Component: function Open({ className, files }) {
      const { t } = useI18n()
      const history = useHistory()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="openwith"
          onClick={() =>
            history.push({
              pathname: `/paper/file/${files[0]._id}`
            })
          }
        >
          {t('action.open')}
        </ActionMenuItemWrapper>
      )
    }
  }
}

export const forward = ({ client }) => {
  return {
    action: (files, t) => forwardFile(client, files, t),
    Component: function Forward({ onClick, className }) {
      const { t } = useI18n()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="reply"
          onClick={onClick}
        >
          {t('action.forward')}
        </ActionMenuItemWrapper>
      )
    }
  }
}

export const download = ({ client }) => {
  return {
    action: files => downloadFiles(client, files),
    Component: function Download({ onClick, className }) {
      const { t } = useI18n()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="download"
          onClick={onClick}
        >
          {t('action.download')}
        </ActionMenuItemWrapper>
      )
    }
  }
}

export const trash = ({ pushModal, popModal }) => {
  return {
    action: files =>
      pushModal(
        <DeleteConfirm
          files={files}
          referenced={isReferencedBy(files, CONTACTS_DOCTYPE)}
          onClose={popModal}
        />
      ),
    Component: function Trash({ onClick, className }) {
      const { t } = useI18n()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="trash"
          iconProps={{ color: 'var(--errorColor)' }}
          typographyProps={{ color: 'error' }}
          onClick={onClick}
        >
          {t('action.trash')}
        </ActionMenuItemWrapper>
      )
    }
  }
}

export const viewInDrive = ({ client }) => {
  return {
    Component: function ViewInDrive({ onClick, className, files }) {
      const { t } = useI18n()
      const dirId = files[0].dir_id

      const webLink = generateWebLink({
        slug: 'drive',
        cozyUrl: client.getStackClient().uri,
        subDomainType: client.getInstanceOptions().subdomain,
        pathname: '/',
        hash: `folder/${dirId}`
      })

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="folder"
          text={t('action.viewInDrive')}
          onClick={onClick}
        >
          <Link href={webLink} target="_blank" className={'u-p-0'}>
            {t('action.viewInDrive')}
          </Link>
        </ActionMenuItemWrapper>
      )
    }
  }
}

export const select = ({ hideActionsMenu }) => {
  return {
    Component: function Select({ className, files }) {
      const { t } = useI18n()
      const history = useHistory()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="select-all"
          onClick={() => {
            history.push({
              pathname: `/paper`
            })
            hideActionsMenu()
          }}
        >
          {files.length === 0 ? t('action.selectPapers') : t('action.select')}
        </ActionMenuItemWrapper>
      )
    }
  }
}

export const help = () => {
  return {
    isEnabled: false,
    Component: function Help({ className, isEnabled }) {
      const { t } = useI18n()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="help"
          isEnabled={isEnabled}
        >
          {t('action.help')}
        </ActionMenuItemWrapper>
      )
    }
  }
}

export const installHomepage = () => {
  return {
    isEnabled: false,
    Component: function InstallHomepage({ className, isEnabled }) {
      const { t } = useI18n()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="openwith"
          isEnabled={isEnabled}
        >
          {t('action.installHomepage')}
        </ActionMenuItemWrapper>
      )
    }
  }
}
