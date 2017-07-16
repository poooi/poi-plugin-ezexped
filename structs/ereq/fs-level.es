import {
  requireFlagship,
  wrapBool,
  singObj,
} from './common'

class FSLevel {
  static make = singObj('level')

  static prepare = ({level}) => () =>
    requireFlagship(fs =>
      wrapBool(fs.level >= level))
}

export { FSLevel }
