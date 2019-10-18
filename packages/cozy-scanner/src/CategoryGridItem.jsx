import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import palette from 'cozy-ui/transpiled/react/palette'
import { Icon, IconStack } from 'cozy-ui/transpiled/react'

import styles from './styles.styl'

const CategoryGridItem = ({ isSelected, icon, theme, label }) => {
  return (
    <div
      className={classNames(
        styles['grid-item'],
        'u-pb-half u-ph-half u-bxz  u-ellipsis u-c-pointer',
        {
          [styles['border-selected']]: isSelected,
          [styles['grid-item__selected']]: isSelected && label,
          [styles['grid-item__selected__without_label']]: isSelected && !label,
          [styles['border-not-selected']]: !isSelected
        }
      )}
    >
      <IconStack
        foreground={
          icon ? (
            <Icon
              icon={icon}
              color={isSelected ? palette.dodgerBlue : palette.coolGrey}
              size={'16'}
            />
          ) : null
        }
        background={
          <Icon
            icon={'file-duotone'}
            size={'32'}
            color={isSelected ? palette.dodgerBlue : palette.coolGrey}
          />
        }
      />

      <div className="u-flex u-flex-column u-ellipsis u-bxz">
        <span className={classNames(styles['grid-item-theme'], 'u-ellipsis')}>
          {theme}
        </span>
        {label && (
          <span className={classNames(styles['grid-item-label'], 'u-ellipsis')}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
CategoryGridItem.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  icon: PropTypes.string,
  theme: PropTypes.string.isRequired,
  label: PropTypes.string
}

export default CategoryGridItem
