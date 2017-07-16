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
        {sat: false, tooltip: nonSparkledShips} :
        {sat: true, tooltip: null}
    })
}

export { AllSparkled }
