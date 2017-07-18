import _ from 'lodash'
import { onFleetShips, singObj } from './common'
import {
  esFleetCompoToPairs,
  isESType,
} from '../../estype'

/*
   it makes sense memoizing this function, as `compo` is
   constructed at module loading time (by '../../exped-reqs') and
   is never changed afterwards
 */
const computeResult = _.memoize(compo => {
  const fcReqPairs = esFleetCompoToPairs(compo)
  return ships => {
    const results = fcReqPairs.map(([estype, need]) => {
      const actual = ships.filter(s =>
        isESType[estype](s.stype, s.mstId)).length
      return {
        estype,
        need,
        actual,
        sat: actual >= need,
      }
    })

    const sat = results.every(r => r.sat)
    return {sat, extra: {type: 'FleetCompo', results}}
  }
})

class FleetCompo {
  static make = singObj('compo')

  static prepare = ({compo}) => {
    const f = computeResult(compo)
    return () => onFleetShips(f)
  }
}

export {
  computeResult,
  FleetCompo,
}
