import { Request, Response } from 'express'
import { createRBAC, listRoles } from '../services/rbac.service'
import { CreatedResponse, OKResponse, Success } from '~/models/Success'
import db from '~/db/init.mongo'

class RbacController {
  async createRbac(req: Request, res: Response) {
    const { role, permissions, resource } = req.body
    const client = await db.instance?.startSession()
    client?.withTransaction(async (session) => {
      try {
        const rbac = await createRBAC(role, permissions, resource, session)
        await session.commitTransaction()
        return new CreatedResponse('RBAC created successfully', rbac).send(res)
      } catch (error) {
        await session.abortTransaction()
        throw error
      }
    })
  }

  async listRoles(req: Request, res: Response) {
    const roles = await listRoles()
    return new OKResponse('Roles fetched successfully', roles).send(res)
  }
}

export default new RbacController()
