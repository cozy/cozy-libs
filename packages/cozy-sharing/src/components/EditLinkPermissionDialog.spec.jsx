import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { createMockClient } from 'cozy-client'
import AppLike from '../../test/AppLike'
import EditLinkPermissionDialog from './EditLinkPermissionDialog'

const READ_ONLY_PERMISSIONS = [
  {
    attributes: {
      type: 'share',
      source_id: 'io.cozy.apps/drive',
      permissions: {
        files: {
          type: 'io.cozy.files',
          verbs: ['GET'],
          values: ['777491f11a567fb45e8b091fe109aa9c']
        }
      }
    }
  }
]

describe('EditLinkPermissionDialog', () => {
  const client = createMockClient({})

  const setup = props => {
    return render(
      <AppLike client={client}>
        <EditLinkPermissionDialog open onClose={() => {}} {...props} />
      </AppLike>
    )
  }

  it('should update permissions', () => {
    const onChangePermissions = jest.fn()

    const props = {
      document: {
        _id: '777491f11a567fb45e8b091fe109aa9c'
      },
      documentType: 'Files',
      permissions: READ_ONLY_PERMISSIONS,
      onChangePermissions
    }

    const { getByText } = setup(props)

    fireEvent.click(getByText('Modify file'))

    fireEvent.click(getByText('OK'))

    expect(onChangePermissions).toHaveBeenCalledWith(props.document, [
      'GET',
      'POST',
      'PUT',
      'PATCH'
    ])
  })

  it('should not change permissions if nothing done', () => {
    const onChangePermissions = jest.fn()

    const props = {
      document: {
        _id: '777491f11a567fb45e8b091fe109aa9c'
      },
      documentType: 'Files',
      permissions: READ_ONLY_PERMISSIONS,
      onChangePermissions
    }

    const { getByText } = setup(props)

    fireEvent.click(getByText('OK'))

    expect(onChangePermissions).not.toHaveBeenCalled()
  })
})
