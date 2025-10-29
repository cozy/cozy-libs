import cx from 'classnames'
import React from 'react'

import { components } from 'cozy-ui/transpiled/react/SelectBox'
import Typography from 'cozy-ui/transpiled/react/Typography'

import styles from './styles.styl'
import GroupCreation from '../GroupCreation'

const Menu = ({ children, selectProps, className, ...props }) => {
  const { createGroup, ...restSelectProps } = selectProps

  return (
    <components.Menu
      {...props}
      className={cx(className, styles['menu'])}
      selectProps={restSelectProps}
    >
      <Typography variant="body1" component="div">
        {children}
        <GroupCreation createGroup={createGroup} />
      </Typography>
    </components.Menu>
  )
}

export default Menu
