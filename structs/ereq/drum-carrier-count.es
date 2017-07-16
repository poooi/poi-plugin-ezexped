import {
  onFleetShips,
  requireGreaterOrEqual,

  isEqpDrum,
  singObj,
} from './common'

class DrumCarrierCount {
  static make = singObj('count')

  static prepare = ({count}) => () =>
    onFleetShips(ships =>
      requireGreaterOrEqual(
        ships.filter(({equips}) => equips.some(isEqpDrum)).length,
        count))
}

export { DrumCarrierCount }
