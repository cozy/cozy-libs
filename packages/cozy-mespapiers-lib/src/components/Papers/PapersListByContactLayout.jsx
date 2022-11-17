import React from 'react'
import PropTypes from 'prop-types'

import { Spinner } from 'cozy-ui/transpiled/react/Spinner'

import PapersListToolbar from '../Papers/PapersListToolbar'
import PapersListByContact from '../Papers/PapersListByContact'

const PapersListByContactLayout = ({
  currentFileTheme,
  paperslistByContact
}) => {
  return (
    <>
      <PapersListToolbar currentFileTheme={currentFileTheme} />
      {paperslistByContact.length > 0 ? (
        <PapersListByContact paperslistByContact={paperslistByContact} />
      ) : (
        <Spinner
          size="xxlarge"
          className="u-flex u-flex-justify-center u-mt-2 u-h-5"
        />
      )}
    </>
  )
}

PapersListByContactLayout.propTypes = {
  currentFileTheme: PropTypes.string,
  paperslistByContact: PropTypes.array
}

export default PapersListByContactLayout
