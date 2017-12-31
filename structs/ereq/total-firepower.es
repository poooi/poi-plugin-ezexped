import _ from 'lodash'
import {
  onFleetShips,
  requireGreaterOrEqual,

  singObj,
} from './common'

class TotalFirepower {
  static make = singObj('antiAir')

  static prepare = ({firepower}) => () =>
    onFleetShips(ships =>
      requireGreaterOrEqual(
        _.sum(ships.map(x => x.firepower)),
        firepower,
        // show tooltip regardless of sat
        true,
      )
    )
}

export { TotalFirepower }
