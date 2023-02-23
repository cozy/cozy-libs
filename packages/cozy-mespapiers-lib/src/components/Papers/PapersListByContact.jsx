import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'

import { DEFAULT_MAX_FILES_DISPLAYED } from '../../constants/const'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { buildFilesByContacts, getCurrentFileTheme } from '../Papers/helpers'
import PapersList from '../Papers/PapersList'

const PapersListByContact = ({
  selectedThemeLabel,
  files,
  connector,
  accounts,
  contacts
}) => {
  const params = useParams()
  const { t } = useI18n()
  const { papersDefinitions } = usePapersDefinitions()

  const currentFileTheme = getCurrentFileTheme(params, selectedThemeLabel)
  const currentDefinition = useMemo(
    () =>
      papersDefinitions.find(paperDef => paperDef.label === currentFileTheme),
    [papersDefinitions, currentFileTheme]
  )

  const paperslistByContact = useMemo(
    () =>
      buildFilesByContacts({
        files,
        contacts,
        maxDisplay:
          currentDefinition?.maxDisplay || DEFAULT_MAX_FILES_DISPLAYED,
        t
      }),
    [contacts, currentDefinition, files, t]
  )

  return paperslistByContact.map(({ withHeader, contact, papers }, idx) => (
    <List
      key={idx}
      subheader={
        withHeader && (
          <ListSubheader>
            <div className="u-ellipsis">{contact}</div>
          </ListSubheader>
        )
      }
    >
      <PapersList
        papers={papers}
        connector={connector}
        accounts={accounts}
        isLast={files.length === 1}
      />
    </List>
  ))
}

PapersListByContact.propTypes = {
  selectedThemeLabel: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.object),
  connector: PropTypes.object,
  accounts: PropTypes.array,
  contacts: PropTypes.arrayOf(PropTypes.object)
}

export default PapersListByContact
