import {
  onFleetShips,
  requireGreaterOrEqual,
} from './common'

class ShipCount {
  static prepare = ({count}) => () =>
    onFleetShips(ships =>
      requireGreaterOrEqual(ships.length, count))
}

export { ShipCount }
