import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import TextField from 'cozy-ui/transpiled/react/TextField'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/deprecated/Media'

import styles from './styles.styl'
import { withContactsListLocales } from '../withContactsListLocales'

const AddContactContent = ({ t, setContactValues }) => {
  const handleChange = ev => {
    const { name, value } = ev.target
    setContactValues(v => ({ ...v, [name]: value }))
  }

  return (
    <>
      <Typography variant="h5">{t('coordinates')}</Typography>
      <Media>
        <Img className={styles.icon}>
          <Icon icon={PeopleIcon} />
        </Img>
        <Bd className="u-mr-1">
          <TextField
            className="u-mt-1"
            variant="outlined"
            fullWidth
            id="givenName"
            name="givenName"
            label={t('givenName')}
            onChange={handleChange}
          />
        </Bd>
      </Media>
      <Media>
        <Bd className="u-ml-3 u-mr-1">
          <TextField
            className="u-mt-1"
            variant="outlined"
            fullWidth
            id="familyName"
            name="familyName"
            label={t('familyName')}
            onChange={handleChange}
          />
        </Bd>
      </Media>
    </>
  )
}

AddContactContent.propTypes = {
  t: PropTypes.func,
  setContactValues: PropTypes.func
}

export default withContactsListLocales(AddContactContent)
