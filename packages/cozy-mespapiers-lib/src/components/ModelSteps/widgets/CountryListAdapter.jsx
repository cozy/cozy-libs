import PropType from 'prop-types'
import React, { useState, useEffect, Fragment } from 'react'

import {
  getAllCountries,
  isValidCountryCodeTranslation
} from 'cozy-client/dist/models/country/countries'
import { getLocalizer } from 'cozy-client/dist/models/country/locales'
import Divider from 'cozy-ui/transpiled/react/Divider'
import List from 'cozy-ui/transpiled/react/List'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'
import TextField from 'cozy-ui/transpiled/react/TextField'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { CountryRadio } from './CountryRadio'

const DISPLAYED_OPTION_COUNT = 20
export const CountryListAdapter = ({
  attrs: { name },
  formDataValue = '',
  setValue,
  setValidInput,
  idx
}) => {
  const { t, lang } = useI18n()
  const { t: tCountry } = getLocalizer(lang)

  const translatedFormDataValue = isValidCountryCodeTranslation(
    lang,
    formDataValue
  )
    ? tCountry(`nationalities.${formDataValue}`)
    : null
  const [searchValue, setSearchValue] = useState(translatedFormDataValue || '')
  const [displayedOptionCount, setDisplayedOptionCount] = useState(
    DISPLAYED_OPTION_COUNT
  )
  const [currentOption, setCurrentOption] = useState({
    value: isValidCountryCodeTranslation(lang, formDataValue)
      ? formDataValue
      : ''
  })

  const handleViewMore = () => {
    setDisplayedOptionCount(prev => prev + DISPLAYED_OPTION_COUNT)
  }

  const handleClick = opt => {
    setCurrentOption(opt)
    setValue(prev => ({
      ...prev,
      [name]: opt.value
    }))
  }

  const sortedCountries = getAllCountries(lang).sort((a, b) =>
    a.nationality.localeCompare(b.nationality)
  )
  const options = sortedCountries.map(({ nationality, code2 }) => ({
    label: nationality,
    value: code2
  }))

  const filteredOptions = options.filter(
    opt =>
      opt.label.toLowerCase().includes(searchValue.toLowerCase()) ||
      opt.value.toLowerCase().includes(searchValue.toLowerCase())
  )

  /* Necessary to validate or not the validation button of the current step */
  useEffect(() => {
    setValidInput(prev => ({
      ...prev,
      [idx]: !!currentOption.value
    }))
  }, [setValidInput, currentOption.value, idx])

  return (
    <>
      <TextField
        variant="outlined"
        type="text"
        label={t('CountryListAdapter.search')}
        id="contries-search-id"
        fullWidth
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        autoFocus={!currentOption.value}
      />
      <List>
        <>
          {filteredOptions
            .slice(0, displayedOptionCount)
            .map((option, indexOption) => (
              <Fragment key={indexOption}>
                <CountryRadio
                  option={option}
                  onClick={() => handleClick(option)}
                  value={currentOption.value}
                />
                {indexOption !== filteredOptions.length - 1 && (
                  <Divider
                    component="li"
                    variant="inset"
                    style={{ marginLeft: '2.5rem' }}
                  />
                )}
              </Fragment>
            ))}

          {displayedOptionCount < filteredOptions.length && (
            <LoadMore
              fetchMore={handleViewMore}
              label={t('CountryListAdapter.seeMore')}
            />
          )}
        </>
      </List>
    </>
  )
}

CountryListAdapter.propTypes = {
  attrs: PropType.shape({
    name: PropType.string
  }),
  formDataValue: PropType.string,
  setValue: PropType.func,
  setValidInput: PropType.func,
  idx: PropType.number
}
