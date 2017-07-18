import {
  onFleetShips,
  requireGreaterOrEqual,
  isShipSparkled,
} from './common'

class SparkledCountCustom {
  static make = () => {}

  static prepare = () => ({sparkledCount}) =>
    onFleetShips(ships => {
      const {sat, extra} =
        requireGreaterOrEqual(
          ships.filter(isShipSparkled).length,
          sparkledCount)
      return {
        sat,
        extra: {
          ...extra,
          sparkledCount,
          type: 'SparkledCountCustom',
        },
      }
    })
}

export { SparkledCountCustom }
