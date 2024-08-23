import { IPermissions, Permissions } from '~/v1/models/account/permissions.schema'
import { IRole, RoleModel } from '~/v1/models/account/roles.schema'
import { IPermissionRole, PermissionRole } from '~/v1/models/account/permission-roles.schema'
export const generateData = async (): Promise<IPermissionRole[]> => {
  // Roles
  const roles: IRole[] = [
    {
      name: 'Admin',
      permissions: []
    },
    {
      name: 'Seller',
      permissions: []
    },
    {
      name: 'Buyer',
      permissions: []
    }
  ]

  const permissions: IPermissions[] = [
    {
      path: '/api/v1/account/signup',
      method: 'POST',
      description: 'Signup a new user',
      roles: []
    },
    {
      path: '/api/v1/account/login',
      method: 'POST',
      description: 'Login a user',
      roles: []
    },
    {
      path: '/api/v1/account/logout',
      method: 'POST',
      description: 'Logout a user',
      roles: []
    }
  ]

  const rolesPromises = roles.map((role) => {
    const newRole = new RoleModel(role)
    return newRole.save()
  })

  const permissionsPromises = permissions.map((permission) => {
    const newPermission = new Permissions(permission)
    return newPermission.save()
  })

  await Promise.all([Promise.allSettled(rolesPromises), Promise.allSettled(permissionsPromises)])

  const listRoles = await RoleModel.find()
  const listPermissions = await Permissions.find()

  console.log('Roles:', listRoles)
  console.log('Permissions:', listPermissions)

  // PermissionRoles
  const permissionRoles: IPermissionRole[] = listRoles.flatMap((role) =>
    listPermissions.map((permission) => ({
      role: role.id,
      permissions: permission.id
    }))
  )

  const permissionRolesPromises = permissionRoles.map((permissionRole) => {
    const newPermissionRole = new PermissionRole(permissionRole)
    return newPermissionRole.save()
  })

  return Promise.all(permissionRolesPromises)
}

export default generateData
