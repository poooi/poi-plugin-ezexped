import {
  onFleetShips,
  requireGreaterOrEqual,
  isShipSparkled,
  singObj,
} from './common'

class GSRateNorm {
  static make = () => {}

  static prepare = () => () =>
    onFleetShips(ships => {
      const shipsCount = ships.length
      const sparkledShipsCount = ships.filter(s => isShipSparkled(s)).length
      const gsRate = sparkledShipsCount === shipsCount ?
        Math.round((shipsCount * 15 + 20) / 0.0099) / 100 : 0
      return requireGreaterOrEqual(gsRate, 100)
  })
}

export { GSRateNorm }
