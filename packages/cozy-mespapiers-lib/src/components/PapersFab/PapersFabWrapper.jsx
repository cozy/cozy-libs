import PropTypes from 'prop-types'
import React, { cloneElement, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useClient, Q } from 'cozy-client'
import { isInstalled } from 'cozy-client/dist/models/applications'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'

import useGeneralActions from './useGeneralActions'
import useKonnectorsActions from './useKonnectorsActions'
import { isReminder } from '../../components/Placeholders/helpers'
import { APPS_DOCTYPE } from '../../doctypes'

const PapersFabWrapper = ({ children }) => {
  const navigate = useNavigate()
  const actionBtnRef = useRef()
  const { pathname } = useLocation()
  const [showGeneralMenu, setShowGeneralMenu] = useState(false)
  const [showKonnectorMenu, setShowKonnectorMenu] = useState(false)
  const client = useClient()

  const redirectPaperCreation = async paperDefinition => {
    setShowKonnectorMenu(false)
    const redirectPath = `${pathname}/create/${paperDefinition.label}`
    const countrySearchParam = `${
      paperDefinition.country ? `country=${paperDefinition.country}` : ''
    }`

    if (isReminder(paperDefinition)) {
      const { data: apps } = await client.query(Q(APPS_DOCTYPE))
      const isNoteAppInstalled = !!isInstalled(apps, { slug: 'notes' })

      if (!isNoteAppInstalled) {
        return navigate({
          pathname: `${pathname}/installAppIntent`,
          search: `redirect=${redirectPath}`
        })
      }
    }

    return navigate({
      pathname: redirectPath,
      search: countrySearchParam
    })
  }

  const generalActions = useGeneralActions({
    setShowGeneralMenu,
    setShowKonnectorMenu,
    redirectPaperCreation
  })

  const konnectorsActions = useKonnectorsActions({ redirectPaperCreation })

  if (!children) return null

  const handleClick = () => {
    return generalActions.length === 0
      ? navigate('create')
      : setShowGeneralMenu(prev => !prev)
  }

  const PapersFabOverrided = cloneElement(children, {
    onClick: handleClick,
    innerRef: actionBtnRef,
    a11y: {
      'aria-controls':
        showGeneralMenu || showKonnectorMenu ? 'fab-menu' : undefined,
      'aria-haspopup': true,
      'aria-expanded': showGeneralMenu || showKonnectorMenu ? true : undefined
    }
  })

  return (
    <>
      {PapersFabOverrided}

      {showGeneralMenu && (
        <ActionsMenu
          ref={actionBtnRef}
          open={showGeneralMenu}
          actions={generalActions}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          onClose={() => setShowGeneralMenu(false)}
        />
      )}

      {showKonnectorMenu && (
        <ActionsMenu
          ref={actionBtnRef}
          open={showKonnectorMenu}
          actions={konnectorsActions}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          onClose={() => setShowKonnectorMenu(false)}
        />
      )}
    </>
  )
}

PapersFabWrapper.propTypes = {
  children: PropTypes.node
}

export default PapersFabWrapper
