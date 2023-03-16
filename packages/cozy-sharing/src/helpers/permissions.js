import get from 'lodash/get'

import { models } from 'cozy-client'

export const checkIsReadOnlyPermissions = permissions => {
  const permissionCategories = get(
    permissions,
    '[0].attributes.permissions',
    {}
  )
  return (
    Object.values(permissionCategories).filter(permissionCategory =>
      models.permission.isReadOnly(permissionCategory)
    ).length > 0
  )
}
