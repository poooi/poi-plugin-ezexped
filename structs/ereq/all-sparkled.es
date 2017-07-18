import {
  onFleetShips,
  isShipSparkled,
  mkShipList,
} from './common'

class AllSparkled {
  static make = () => {}

  static prepare = () => () =>
    onFleetShips(ships => {
      const nonSparkledShips = ships.filter(s => ! isShipSparkled(s))
      return {
        sat: nonSparkledShips.length === 0,
        extra: mkShipList(nonSparkledShips),
      }
    })
}

export { AllSparkled }
