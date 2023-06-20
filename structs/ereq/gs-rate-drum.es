import {
  onFleetShips,
  isShipSparkled,
  isEqpDrum,
  sum,
} from './common'

const computeResult = (min, max, gsRateCustom) => ships => {
  const sparkledShipsCount = ships.filter(s => isShipSparkled(s)).length
  const drumCount = sum(ships.map(({equips}) => equips.filter(isEqpDrum).length))
  const gsRate =
    drumCount >= max ? Math.round((sparkledShipsCount * 15 + 40) / 0.0099) / 100 :
    min === 0 ? Math.round((sparkledShipsCount * 15 + 20) / 0.0099) / 100 :
    drumCount >= min ? Math.round((sparkledShipsCount * 15 + 5) / 0.0099) / 100 : 0
  return {sat: gsRate >= gsRateCustom, extra: {type: 'GSRate', rate: gsRate, custom: gsRateCustom}}
}

class GSRateDrum {
  static make = (min, max) => ({min, max})

  static prepare = ({min, max}) => ({gsRateCustom}) =>
    onFleetShips(computeResult(min, max, gsRateCustom))
}

export { GSRateDrum }
