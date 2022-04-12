import {
  onFleetShips,
  isShipSparkled,
  isEqpDrum,
  sum,
} from './common'

class GSRateDrum {
  static make = () => ({})

  static prepare = () => () =>
    onFleetShips(ships => {
      const sparkledShipsCount = ships.filter(s => isShipSparkled(s)).length
      const drumCount = sum(ships.map(({equips}) => equips.filter(isEqpDrum).length))
      const gsRate = Math.round((sparkledShipsCount * 15 + 40) / 0.0099) / 100
      return {sat: gsRate >= 100, extra: {type: 'GSRate', rate: gsRate, drum: drumCount}}
    })
}

export { GSRateDrum }
