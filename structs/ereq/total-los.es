import _ from 'lodash'
import {
  onFleetShips,
  requireGreaterOrEqual,

  singObj,
} from './common'

class TotalLos {
  static make = singObj('los')

  static prepare = ({los}) => () =>
    onFleetShips(ships =>
      requireGreaterOrEqual(
        _.sum(ships.map(x => x.los)),
        los,
        // show tooltip regardless of sat
        true,
      )
    )
}

export { TotalLos }
