import {
  describeEReq,
  mkFleet,
  satisfied, notSatisfied,
} from './common'

import { stype as st } from '../../../estype'

import { AnyFleetCompo } from '../../../structs/ereq/any-fleet-compo'

describeEReq('AnyFleetCompo', () => {
  const mkShips = (...stypes) => stypes.map(stype => ({stype}))
  const {CL, DD, CA, AV, CVL} = st
  const fleet = mkShips(CL, DD, DD, CA, AV, CVL)

  const compo1 = {CA: 2}
  const compo2 = {CL: 1, DD: 1}
  const compo3 = {CL: 1, DD: 2}

  {
    const compos = [compo1, compo2]
    const f = AnyFleetCompo.prepare({compos})()
    notSatisfied(f, mkFleet(1, ind => fleet[ind]))
    satisfied(f, mkFleet(2, ind => fleet[ind]))
  }
  {
    const compos = [compo1, compo3]
    const f = AnyFleetCompo.prepare({compos})()
    notSatisfied(f, mkFleet(2, ind => fleet[ind]))
    satisfied(f, mkFleet(3, ind => fleet[ind]))
  }
})
