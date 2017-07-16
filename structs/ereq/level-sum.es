import {
  onFleetShips,
  wrapBool,
  sum,
} from './common'

class LevelSum {
  static prepare = ({level}) => () =>
    onFleetShips(ships =>
      wrapBool(
        sum(ships.map(s => s.level)) >= level))
}

export { LevelSum }
