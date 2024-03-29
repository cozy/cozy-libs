import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import EditLinkPermissionDialog from './EditLinkPermissionDialog'
import AppLike from '../../test/AppLike'

describe('EditLinkPermissionDialog', () => {
  const client = createMockClient({})

  const setup = props => {
    return render(
      <AppLike client={client}>
        <EditLinkPermissionDialog open onClose={() => {}} {...props} />
      </AppLike>
    )
  }

  it('should select read permissions', () => {
    const onPermissionsSelected = jest.fn()

    const props = {
      onPermissionsSelected
    }

    const { getByText } = setup(props)

    fireEvent.click(getByText('OK'))

    expect(onPermissionsSelected).toHaveBeenCalledWith({
      verbs: ['GET']
    })
  })

  it('should select write permissions', () => {
    const onPermissionsSelected = jest.fn()

    const props = {
      onPermissionsSelected
    }

    const { getByText } = setup(props)

    fireEvent.click(getByText('Modify file'))

    fireEvent.click(getByText('OK'))

    expect(onPermissionsSelected).toHaveBeenCalledWith({
      verbs: ['GET', 'POST', 'PUT', 'PATCH']
    })
  })
})
