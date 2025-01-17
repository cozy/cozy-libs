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

export const checkIsPermissionHasExpiresDate = permissions => {
  return Boolean(permissions?.[0]?.attributes?.expires_at)
}

export const getPermissionExpiresDate = permissions => {
  return permissions?.[0]?.attributes?.expires_at
}

export const checkIsPermissionHasPassword = permissions => {
  return Boolean(permissions?.[0]?.attributes?.password)
}
