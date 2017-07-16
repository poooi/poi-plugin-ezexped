import {
  onFleetShips,
  requireGreaterOrEqual,
  isShipSparkled,
} from './common'

class SparkledCountCustom {
  static make = () => {}

  static prepare = () => ({sparkledCount}) =>
    onFleetShips(ships =>
      requireGreaterOrEqual(
        ships.filter(isShipSparkled).length,
        sparkledCount))
}

export { SparkledCountCustom }
