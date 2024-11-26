import { ClientSession, ObjectId, Types } from 'mongoose'
import { IRole, RoleModel } from '../models/account/roles.schema'
import { IPermission, IPermissionDocument, PermissionModel } from '../models/account/permissions.schema'
import { IResource, ResourceModel } from '../models/account/resources.schema'

interface RBACModelResponse {
  role: string
  resource: string
  action: string
  attributes: string
}

const listRoles = async () => {
  const rbac = (await RoleModel.aggregate([
    {
      $lookup: {
        from: 'permissions',
        localField: 'permissions',
        foreignField: '_id',
        as: 'permissions'
      }
    },
    {
      $lookup: {
        from: 'resources',
        localField: 'permissions.resource',
        foreignField: '_id',
        as: 'resources'
      }
    },
    {
      $unwind: '$resources'
    },
    {
      $unwind: '$permissions'
    },
    {
      $project: {
        _id: 0,
        role: '$name',
        resource: '$resources.name',
        action: '$permissions.action',
        attributes: '$permissions.attributes'
      }
    }
  ])) as RBACModelResponse[]

  return rbac
}

const getRole = async (roleId: string): Promise<RBACModelResponse[]> => {
  const rbac = await RoleModel.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(roleId)
      }
    },
    {
      $lookup: {
        from: 'permissions',
        localField: 'permissions',
        foreignField: '_id',
        as: 'permissions'
      }
    },
    {
      $lookup: {
        from: 'resources',
        localField: 'permissions.resource',
        foreignField: '_id',
        as: 'resources'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        permissions: {
          $map: {
            input: '$permissions',
            as: 'permission',
            in: {
              resource: '$$permission.resource',
              action: '$$permission.action',
              attributes: '$$permission.attributes'
            }
          }
        }
      }
    }
  ])
  console.log(rbac)
  return rbac
}

const createRole = async (role: IRole, session: ClientSession) => {
  const newRole = new RoleModel(role)
  return newRole.save({ session })
}

const createPermission = async (permissions: IPermission[], session: ClientSession) => {
  const newPermissions = await Promise.all(
    permissions.map(async (permission) => {
      const newPermission = new PermissionModel(permission)
      return newPermission.save({ session })
    })
  )
  return newPermissions
}

const createResource = async (resource: IResource, session: ClientSession) => {
  const newResource = new ResourceModel(resource)
  return newResource.save({ session })
}

const createRBAC = async (role: IRole, permissions: IPermission[], resource: IResource, session: ClientSession) => {
  const newResource = await createResource(resource, session)
  const permissionsWithResource = permissions.map(
    (permission) => ({ ...permission, resource: newResource.id }) as IPermission
  )
  const newPermissions = await createPermission(permissionsWithResource, session)
  const newRole = await createRole(
    {
      ...role,
      permissions: newPermissions.map((permission) => permission.id)
    },
    session
  )
  return newRole.populate('permissions', 'permissions.resource')
}

export { RBACModelResponse, listRoles, getRole, createRole, createPermission, createResource, createRBAC }
