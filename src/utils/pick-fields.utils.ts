import { pick } from 'lodash'

export const pickFields = (obj: any, fields: string[]) => {
  return pick(obj, fields)
}
