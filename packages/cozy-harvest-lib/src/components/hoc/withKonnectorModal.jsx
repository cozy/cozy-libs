import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import KonnectorModal from '../KonnectorModal'
import { getDisplayName } from './utils'

export const withKonnectorModal = WrappedComponent => {
  class WrappedComponentWithPropTypes extends WrappedComponent {
    static propTypes = {
      ...WrappedComponent.propTypes,
      closeKonnectorModal: PropTypes.func.isRequired,
      openKonnectorModal: PropTypes.func.isRequired
    }
  }

  class ComponentWithKonnectorModal extends PureComponent {
    state = {
      opened: false
    }

    constructor(props, context) {
      super(props, context)

      this.handleOpenModal = this.handleOpenModal.bind(this)
      this.handleCloseModal = this.handleCloseModal.bind(this)
    }

    handleOpenModal({ konnector, into }) {
      this.setState({
        konnector,
        opened: true,
        into
      })
    }

    handleCloseModal() {
      this.setState({
        opened: false
      })
    }

    render() {
      const { konnector, into, opened } = this.state
      return (
        <>
          <WrappedComponentWithPropTypes
            {...this.props}
            openKonnectorModal={this.handleOpenModal}
            closeKonnectorModal={this.handleCloseModal}
          />
          {opened && (
            <KonnectorModal
              dismissAction={this.handleCloseModal}
              konnector={konnector}
              into={into}
            />
          )}
        </>
      )
    }
  }

  ComponentWithKonnectorModal.displayName = `withKonnectorModal(${getDisplayName(
    WrappedComponent
  )}`

  ComponentWithKonnectorModal.propTypes = {
    ...WrappedComponent.prop
  }

  return ComponentWithKonnectorModal
}

export default withKonnectorModal
