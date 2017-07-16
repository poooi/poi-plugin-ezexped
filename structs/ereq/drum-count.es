import {
  onFleetShips,
  requireGreaterOrEqual,
  isEqpDrum,
  sum,
  singObj,
} from './common'

class DrumCount {
  static make = singObj('count')

  static prepare = ({count}) => () =>
    onFleetShips(ships =>
      requireGreaterOrEqual(
        sum(ships.map(({equips}) => equips.filter(isEqpDrum).length)),
        count))
}

export { DrumCount}
