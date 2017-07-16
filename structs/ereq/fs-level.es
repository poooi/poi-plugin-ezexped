import {
  requireFlagship,
  wrapBool,
} from './common'

class FSLevel {
  static prepare = ({level}) => () =>
    requireFlagship(fs =>
      wrapBool(fs.level >= level))
}

export { FSLevel }
