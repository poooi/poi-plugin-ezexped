import {
  describeEReq,
  mkFleet,
  satisfied, notSatisfied,
} from './common'

import { stype as st } from '../../../estype'

import { FleetCompo } from '../../../structs/ereq/fleet-compo'

describeEReq('FleetCompo', () => {
  const mkShips = (...stypes) => stypes.map(stype => ({stype}))
  const {CL, DD, CA, AV, CVL} = st
  const fleet = mkShips(CL, DD, DD, CA, AV, CVL)
  {
    const compo = {CL: 1, DD: 1}
    const f = FleetCompo.prepare({compo})()
    notSatisfied(f, mkFleet(1, ind => fleet[ind]))
    satisfied(f, mkFleet(2, ind => fleet[ind]))
  }
  {
    const compo = {CL: 1, DD: 2}
    const f = FleetCompo.prepare({compo})()
    notSatisfied(f, mkFleet(2, ind => fleet[ind]))
    satisfied(f, mkFleet(4, ind => fleet[ind]))
  }
  {
    const compo = {CVLike: 2}
    const f = FleetCompo.prepare({compo})()
    notSatisfied(f, mkFleet(5, ind => fleet[ind]))
    satisfied(f, mkFleet(6, ind => fleet[ind]))
  }
  {
    const compo = {CVLike: 2, CA: 1, CL: 1, DD: 2}
    const f = FleetCompo.prepare({compo})()
    notSatisfied(f, mkFleet(5, ind => fleet[ind]))
    satisfied(f, mkFleet(6, ind => fleet[ind]))
  }
})
