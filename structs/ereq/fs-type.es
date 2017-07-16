import {
  requireFlagship,
  wrapBool,
  singObj,
} from './common'

import { isESType } from '../../estype'

class FSType {
  static make = singObj('estype')

  static prepare = ({estype}) => () =>
    requireFlagship(fs =>
      wrapBool(isESType[estype](fs.stype,fs.mstId)))
}

export { FSType }
