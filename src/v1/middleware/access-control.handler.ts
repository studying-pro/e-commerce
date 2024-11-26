import { AccessControl } from 'accesscontrol'
import { NextFunction, Request, Response } from 'express'
import { listRoles } from '../services/rbac.service'
import { HEADER } from '../constants'
import { UserModel } from '../models/account/users.schema'
import { Forbidden, NotFound } from '~/models/Error'
import { RoleModel } from '../models/account/roles.schema'
import Action from '~/constant/action.access-control'
import { getOrSetCache } from '~/utils/cache.utils'

export const accessControl = new AccessControl()

// Load roles and permissions from the database
const loadRolesAndPermissions = async () => {
  const redisKey = 'roles_permissions'
  const cachedRoles = await getOrSetCache(redisKey, async () => {
    const roles = await listRoles()
    return roles
  })
  return cachedRoles
}

accessControl.setGrants(loadRolesAndPermissions())

export const checkRoleAndPermission = async (action: Action, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    const user = await UserModel.findById(userId)
    const role = await RoleModel.findById(user?.role.toString())
    if (!user || !role) {
      throw new NotFound('User or role not found')
    }
    const permission = accessControl.can(role.name)[action](resource)
    if (!permission.granted) {
      throw new Forbidden('You are not authorized to access this resource')
    }
    next()
  }
}
