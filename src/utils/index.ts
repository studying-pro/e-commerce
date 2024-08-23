import _ from 'lodash'

export const getIntoData = (object: Object, fields: string[]) => {
  return _.pick(object, fields)
}
