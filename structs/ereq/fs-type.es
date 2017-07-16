import {
  requireFlagship,
  wrapBool,
} from './common'

import { isESType } from '../../estype'

class FSType {
  static prepare = ({estype}) => () =>
    requireFlagship(fs =>
      wrapBool(isESType[estype](fs.stype,fs.mstId)))
}

export { FSType }
