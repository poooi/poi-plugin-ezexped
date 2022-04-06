import {
  onFleetShips,
  mkShipList,
  isShipSparkled,
} from './common'

class GSHigherLevel {
  static make = () => {}

  static prepare = () => () =>
    onFleetShips(ships => {
      const sparkledShipsCount = ships.filter(s => isShipSparkled(s)).length
      const fsLevel = ships[0].level
      const gsRate = Math.round((sparkledShipsCount * 15 + 15 + Math.floor(Math.sqrt(fsLevel) + fsLevel / 10)) / 0.0099) / 100
      if (gsRate >= 100)
        return {sat: true, extra:{}}

      const higherLvShips = ships.filter(s => s.level > fsLevel)
      return {
        sat: higherLvShips.length === 0,
        extra: mkShipList(higherLvShips),
      }
    })
}

export { GSHigherLevel }
