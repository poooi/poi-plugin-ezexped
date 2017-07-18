import { onFleetShips, singObj } from './common'
import {
  esFleetCompoToPairs,
  isESType,
} from '../../estype'

const computeResult = compo => ships => {
  const fcReqPairs = esFleetCompoToPairs(compo)
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

class FleetCompo {
  static make = singObj('compo')

  static prepare = ({compo}) => () =>
    onFleetShips(computeResult(compo))
}

export {
  computeResult,
  FleetCompo,
}
