import {
  onFleetShips,
  requireGreaterOrEqual,
  isShipSparkled,
} from './common'

class GSRateFlag {
  static make = () => {}

  static prepare = () => () =>
    onFleetShips(ships => {
      const sparkledShipsCount = ships.filter(s => isShipSparkled(s)).length
      const fsLevel = ships[0].level
      const gsRate = Math.round((sparkledShipsCount * 15 + 15 + Math.floor(Math.sqrt(fsLevel) + fsLevel / 10)) / 0.0099) / 100
      return requireGreaterOrEqual(gsRate, 100)
  })
}

export { GSRateFlag }
