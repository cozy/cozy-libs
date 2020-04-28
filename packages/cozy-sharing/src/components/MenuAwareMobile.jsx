import React, { Component } from 'react'
import {
  ActionMenu,
  Menu,
  MenuButton,
  MenuItem,
  withBreakpoints
} from 'cozy-ui/transpiled/react/'
import { UserAvatar } from './Recipient'
import styles from './actionmenu.styl'

class MenuAwareMobile extends Component {
  state = {
    active: false
  }

  toggle = () => {
    this.setState({ active: !this.state.active })
  }
  render() {
    const {
      breakpoints: { isMobile },
      children,
      label,
      buttonClassName,
      name
    } = this.props
    if (isMobile) {
      return (
        <div>
          <MenuButton
            onClick={this.toggle}
            text={label}
            buttonClassName={buttonClassName}
          />
          {this.state.active && (
            <ActionMenu onClose={() => this.toggle()}>
              <MenuItem className={styles['fil-mobileactionmenu']}>
                <UserAvatar name={name} size={'small'} />
              </MenuItem>
              {children}
            </ActionMenu>
          )}
        </div>
      )
    }
    return <Menu {...this.props} />
  }
}

export default withBreakpoints()(MenuAwareMobile)
