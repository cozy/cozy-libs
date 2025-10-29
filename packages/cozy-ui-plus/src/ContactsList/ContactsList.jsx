import PropTypes from 'prop-types'
import React from 'react'

import List from 'cozy-ui/transpiled/react/List'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'
import { Table } from 'cozy-ui/transpiled/react/deprecated/Table'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ContactRow from './ContactRow'
import { sortContacts, categorizeContacts, sortHeaders } from './helpers'
import withContactsListLocales from './locales/withContactsListLocales'

const ContactsList = ({ contacts, onItemClick, ...rest }) => {
  const { t } = useI18n()
  const sortedContacts = sortContacts(contacts)
  const categorizedContacts = categorizeContacts(sortedContacts, t)
  const sortedHeaders = sortHeaders(categorizedContacts, t)
  const { isDesktop } = useBreakpoints()

  return (
    <Table {...rest}>
      {sortedHeaders.map(header => (
        <List
          key={header}
          subheader={
            <ListSubheader gutters={isDesktop ? 'double' : 'default'}>
              {header}
            </ListSubheader>
          }
        >
          {categorizedContacts[header].map((contact, index) => (
            <ContactRow
              key={contact._id}
              id={contact._id}
              contact={contact}
              divider={index !== categorizedContacts[header].length - 1}
              onClick={onItemClick}
            />
          ))}
        </List>
      ))}
    </Table>
  )
}

ContactsList.propTypes = {
  contacts: PropTypes.array.isRequired,
  onItemClick: PropTypes.func
}

export default withContactsListLocales(ContactsList)
