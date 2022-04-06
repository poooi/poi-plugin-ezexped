import {
  onFleetShips,
  isShipSparkled,
} from './common'

class GSRateNorm {
  static make = () => {}

  static prepare = () => () =>
    onFleetShips(ships => {
      const shipsCount = ships.length
      const sparkledShipsCount = ships.filter(s => isShipSparkled(s)).length
      const gsRate = sparkledShipsCount === shipsCount ?
        Math.round((shipsCount * 15 + 20) / 0.0099) / 100 : 0
      return {sat: gsRate >= 100, extra: {type:'GSRate', rate: gsRate}}
  })
}

export { GSRateNorm }
