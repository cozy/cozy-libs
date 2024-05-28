import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'
import SelectBox, { components } from 'cozy-ui/transpiled/react/SelectBox'

import logger from '../logger'
import styles from '../styles/share.styl'

const DropdownIndicator = props => (
  <components.DropdownIndicator {...props}>
    <Icon icon={BottomIcon} color="var(--iconTextColor)" />
  </components.DropdownIndicator>
)

const Option = props => (
  <components.Option {...props}>
    <div className={cx(styles['select-option'])}>
      {props.isSelected && (
        <Icon icon={CheckIcon} color="var(--primaryColor)" />
      )}
      <div>
        <div className={styles['select-option-label']}>{props.label}</div>
        <div className={styles['select-option-desc']}>{props.data.desc}</div>
      </div>
    </div>
  </components.Option>
)

const customStyles = {
  option: (base, state) => ({
    ...base,
    color: 'var(--primaryTextColor)',
    backgroundColor: state.isFocused ? 'var(--actionColorHover)' : null,
    padding: 0,
    borderBottom:
      state.options.findIndex(o => o.value === state.value) === 0
        ? '1px solid var(--borderMainColor)'
        : null
  }),
  menu: base => ({
    ...base,
    backgroundColor: 'var(--paperBackgroundColor)',
    width: '204%'
  })
}

const ShareTypeSelect = ({ options, onChange }) => (
  <div className={styles['select-wrapper']}>
    <SelectBox
      name="select"
      classNamePrefix="needsclick react-select"
      components={{ DropdownIndicator, Option }}
      styles={customStyles}
      defaultValue={options[0]}
      isSearchable={false}
      onChange={option => {
        onChange(option.value)
      }}
      options={options}
      menuPosition="fixed"
    />
  </div>
)

ShareTypeSelect.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired
}

ShareTypeSelect.defaultProps = {
  onChange: logger.log,
  value: ''
}

export default ShareTypeSelect
