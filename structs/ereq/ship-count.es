import {
  onFleetShips,
  requireGreaterOrEqual,
  singObj,
} from './common'

class ShipCount {
  static make = singObj('count')

  static prepare = ({count}) => () =>
    onFleetShips(ships =>
      requireGreaterOrEqual(ships.length, count))
}

export { ShipCount }
