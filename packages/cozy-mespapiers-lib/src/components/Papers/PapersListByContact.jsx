import React from 'react'
import PropTypes from 'prop-types'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'

import PapersList from '../Papers/PapersList'

const PapersListByContact = ({ paperslistByContact }) => {
  return paperslistByContact.map(({ withHeader, contact, papers }, idx) => (
    <List
      subheader={withHeader && <ListSubheader>{contact}</ListSubheader>}
      key={idx}
    >
      <PapersList papers={papers} />
    </List>
  ))
}

PapersListByContact.propTypes = {
  paperslistByContact: PropTypes.arrayOf(PropTypes.object)
}

export default PapersListByContact
