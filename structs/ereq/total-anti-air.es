import _ from 'lodash'
import {
  onFleetShips,
  requireGreaterOrEqual,

  singObj,
} from './common'

class TotalAntiAir {
  static make = singObj('antiAir')

  static prepare = ({antiAir}) => () =>
    onFleetShips(ships =>
      requireGreaterOrEqual(
        _.sum(ships.map(x => x.antiAir)),
        antiAir,
        // show tooltip regardless of sat
        true,
      )
    )
}

export { TotalAntiAir }
