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
        maxDisplay: currentDefinition?.maxDisplay,
        t
      }),
    [contacts, konnectors, currentDefinition, files, t]
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
          accounts={accounts}
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
  accounts: PropTypes.array,
  contacts: PropTypes.arrayOf(PropTypes.object)
}

export default PapersListByContact
