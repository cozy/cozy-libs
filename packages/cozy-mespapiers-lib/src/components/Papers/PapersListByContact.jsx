import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import List from 'cozy-ui/transpiled/react/List'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import PapersList from '../Papers/PapersList'
import {
  buildFilesByContacts,
  getCurrentQualificationLabel
} from '../Papers/helpers'

const PapersListByContact = ({
  selectedQualificationLabel,
  files,
  konnectors,
  accounts,
  contacts
}) => {
  const params = useParams()
  const { t } = useI18n()
  const { papersDefinitions } = usePapersDefinitions()
  const { accountsWithFiles, accountsWithoutFiles } = accounts
  const hasMultipleAccounts =
    accountsWithFiles.length + accountsWithoutFiles.length > 1

  const currentFileTheme = getCurrentQualificationLabel(
    params,
    selectedQualificationLabel
  )
  const currentDefinition = useMemo(
    () =>
      papersDefinitions.find(paperDef => paperDef.label === currentFileTheme),
    [papersDefinitions, currentFileTheme]
  )

  const paperslistByContact = useMemo(
    () =>
      buildFilesByContacts({
        files,
        konnectors,
        contacts,
        hasMultipleAccounts,
        maxDisplay: currentDefinition?.maxDisplay,
        t
      }),
    [contacts, konnectors, hasMultipleAccounts, currentDefinition, files, t]
  )

  return paperslistByContact.map(
    ({ withHeader, contact, konnector, papers }, idx) => (
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
          konnector={konnector}
          accounts={accountsWithFiles}
          isLast={files.length === 1}
        />
      </List>
    )
  )
}

PapersListByContact.propTypes = {
  selectedQualificationLabel: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.object),
  konnectors: PropTypes.arrayOf(PropTypes.object),
  accounts: PropTypes.shape({
    accountsWithFiles: PropTypes.array,
    accountsWithoutFiles: PropTypes.array
  }),
  contacts: PropTypes.arrayOf(PropTypes.object)
}

export default PapersListByContact
