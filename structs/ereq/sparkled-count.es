import {
  onFleetShips,
  requireGreaterOrEqual,
  isShipSparkled,
  singObj,
} from './common'

class SparkledCount {
  static make = singObj('count')

  static prepare = ({count}) => () =>
    onFleetShips(ships =>
      requireGreaterOrEqual(
        ships.filter(isShipSparkled).length,
        count))
}

export { SparkledCount }
