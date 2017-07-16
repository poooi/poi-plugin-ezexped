import {
  onFleetShips,
  requireGreaterOrEqual,
  isShipSparkled,
} from './common'

class SparkledCount {
  static prepare = ({count}) => () =>
    onFleetShips(ships =>
      requireGreaterOrEqual(
        ships.filter(isShipSparkled).length,
        count))
}

export { SparkledCount }
