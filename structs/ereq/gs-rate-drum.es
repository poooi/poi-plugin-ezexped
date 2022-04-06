import {
  onFleetShips,
  requireGreaterOrEqual,
  isShipSparkled,
  isEqpDrum,
  sum,
  singObj,
} from './common'

class GSRateDrum {
  static make = (min, max) => ({min, max})

  static prepare = ({min, max}) => () =>
    onFleetShips(ships => {
      const sparkledShipsCount = ships.filter(s => isShipSparkled(s)).length
      const drumCount = sum(ships.map(({equips}) => equips.filter(isEqpDrum).length))
      const gsRate = Math.round((sparkledShipsCount * 15 + 40) / 0.0099) / 100
      const {sat,extra} = requireGreaterOrEqual(gsRate, 100)
      return {sat, extra: {...extra, left: gsRate, drum: drumCount}}
  })
}

export { GSRateDrum }
