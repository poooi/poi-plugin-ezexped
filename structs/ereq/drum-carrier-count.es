import {
  onFleetShips,
  requireGreaterOrEqual,

  isEqpDrum,
} from './common'

class DrumCarrierCount {
  static prepare = ({count}) => () =>
    onFleetShips(ships =>
      requireGreaterOrEqual(
        ships.filter(({equips}) => equips.some(isEqpDrum)).length,
        count))
}

export { DrumCarrierCount }
