import {
  onFleetShips,
  isShipSparkled,
  unSatNoFlagship,
} from './common'

class GSRateFlag {
  static make = () => {}

  static prepare = () => ({gsRateCustom}) =>
    onFleetShips(ships => {
      const sparkledShipsCount = ships.filter(s => isShipSparkled(s)).length
      if (ships.length === 0)
        return unSatNoFlagship
      const fsLevel = ships[0].level
      const gsRate = Math.round(
        (sparkledShipsCount * 15 + 15 + Math.floor(Math.sqrt(fsLevel) + fsLevel / 10)
        ) / 0.0099) / 100
      return {sat: gsRate >= gsRateCustom, extra: {type: 'GSRate', rate: gsRate, custom: gsRateCustom}}
    })
}

export { GSRateFlag }
