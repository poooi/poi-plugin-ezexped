import _ from 'lodash'
import {
  onFleetShips,
  requireGreaterOrEqual,

  singObj,
} from './common'

class TotalAsw {
  static make = singObj('asw')

  static prepare = ({asw}) => () =>
    onFleetShips(ships =>
      requireGreaterOrEqual(
        _.sum(ships.map(x => x.asw)),
        asw))
}

export { TotalAsw }
