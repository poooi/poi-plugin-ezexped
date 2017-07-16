import {
  onFleetShips,
  requireGreaterOrEqual,
  isEqpDrum,
  sum,
} from './common'

class DrumCount {
  static prepare = ({count}) => () =>
    onFleetShips(ships =>
      requireGreaterOrEqual(
        sum(ships.map(({equips}) => equips.filter(isEqpDrum).length)),
        count))
}

export { DrumCount}
