import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import React, { useMemo, useState, forwardRef } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Input from 'cozy-ui/transpiled/react/Input'
import InputGroup from 'cozy-ui/transpiled/react/InputGroup'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles(theme => ({
  input: {
    borderRadius: '25px',
    height: '48px',
    boxShadow: theme.shadows[1],
    border: '1px solid transparent',
    maxWidth: '100%',
    '&:hover, &:focus, &:active': {
      border: '1px solid transparent',
      boxShadow: theme.shadows[6]
    },
    '& input': {
      borderRadius: '25px',
      height: '42px',
      maxWidth: '100%'
    }
  }
}))

const SearchInput = forwardRef(
  ({ value = '', minLength = 1, onChange, onFocus, onBlur }, ref) => {
    const { t } = useI18n()
    const styles = useStyles()
    const [currentValue, setCurrentValue] = useState('')

    const delayedSetSearchValue = useMemo(
      () => debounce(event => onChange && onChange(event), 375),
      [onChange]
    )

    const handleChange = ev => {
      const eventValue = ev.target.value

      if (eventValue.length >= minLength) {
        delayedSetSearchValue(ev)
      }
      if (currentValue.length > eventValue.length) {
        if (eventValue.length >= minLength) {
          delayedSetSearchValue(ev)
        } else {
          onChange && onChange({ ...ev, target: { ...ev.target, value: '' } })
        }
      }

      setCurrentValue(eventValue)
    }

    const handleFocus = () => {
      onFocus && onFocus(true)
      onBlur && onBlur(false)
    }
    const handleBlur = () => {
      onFocus && onFocus(false)
      onBlur && onBlur(true)
    }

    return (
      <InputGroup
        className={`${styles.input}`}
        prepend={
          <Icon
            className="u-pl-1"
            icon="magnifier"
            color="var(--secondaryTextColor)"
          />
        }
      >
        <Input
          data-testid="SearchInput"
          placeholder={t('common.search')}
          onChange={handleChange}
          value={currentValue || value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={ref}
          aria-label={t('common.search')}
        />
      </InputGroup>
    )
  }
)

SearchInput.displayName = 'SearchInput'

SearchInput.propTypes = {
  value: PropTypes.string,
  minLength: PropTypes.number,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
}

export default SearchInput
