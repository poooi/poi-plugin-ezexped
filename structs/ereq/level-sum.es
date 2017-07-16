import {
  onFleetShips,
  wrapBool,
  sum,
  singObj,
} from './common'

class LevelSum {
  static make = singObj('level')

  static prepare = ({level}) => () =>
    onFleetShips(ships =>
      wrapBool(
        sum(ships.map(s => s.level)) >= level))
}

export { LevelSum }
