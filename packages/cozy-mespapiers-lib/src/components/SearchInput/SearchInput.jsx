import React, { useMemo } from 'react'
import debounce from 'lodash/debounce'

import InputGroup from 'cozy-ui/transpiled/react/InputGroup'
import Input from 'cozy-ui/transpiled/react/Input'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import MagnifierIcon from 'cozy-ui/transpiled/react/Icons/Magnifier'
import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'

const useStyles = makeStyles({
  input: {
    borderRadius: '25px',
    '& input': {
      borderRadius: '25px'
    }
  }
})

const SearchInput = ({ setSearchValue }) => {
  const { t } = useI18n()
  const styles = useStyles()

  const delayedSetSearchValue = useMemo(
    () => debounce(searchValue => setSearchValue(searchValue), 375),
    [setSearchValue]
  )

  const handleOnChange = ev => {
    delayedSetSearchValue(ev.target.value)
  }

  return (
    <InputGroup
      className={`${styles.input} u-mr-0-s u-mr-1 u-maw-100 `}
      prepend={
        <Icon
          className="u-pl-1"
          icon={MagnifierIcon}
          color="var(--iconTextColor)"
        />
      }
    >
      <Input placeholder={t('search')} onChange={handleOnChange} />
    </InputGroup>
  )
}

export default SearchInput
