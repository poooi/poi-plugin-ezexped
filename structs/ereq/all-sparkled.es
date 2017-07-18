import {
  onFleetShips,
  isShipSparkled,
} from './common'

class AllSparkled {
  static make = () => {}

  static prepare = () => () =>
    onFleetShips(ships => {
      const nonSparkledShips = ships.filter(s => ! isShipSparkled(s))
      return nonSparkledShips.length > 0 ?
        {sat: false, extra: nonSparkledShips} :
        {sat: true, extra: null}
    })
}

export { AllSparkled }
