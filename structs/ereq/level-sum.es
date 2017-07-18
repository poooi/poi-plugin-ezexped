import {
  onFleetShips,
  requireGreaterOrEqual,
  sum,
  singObj,
} from './common'

class LevelSum {
  static make = singObj('level')

  static prepare = ({level}) => () =>
    onFleetShips(ships =>
      requireGreaterOrEqual(
        sum(ships.map(s => s.level)),level))
}

export { LevelSum }
