import {
  describeEReq,
  mkFleet,
  satisfied, notSatisfied,
} from './common'

import { Morale } from '../../../structs/ereq/morale'

describeEReq('Morale', () => {
  const fleet = [
    {morale: 51},
    {morale: 41},
    {morale: 52},
  ]
  {
    const f = Morale.prepare({morale: 51})()
    satisfied(f, mkFleet(1, ind => fleet[ind]))
    notSatisfied(f, mkFleet(2, ind => fleet[ind]))
    notSatisfied(f, mkFleet(3, ind => fleet[ind]))
  }
  {
    const f = Morale.prepare({morale: 40})()
    satisfied(f, mkFleet(1, ind => fleet[ind]))
    satisfied(f, mkFleet(2, ind => fleet[ind]))
    satisfied(f, mkFleet(3, ind => fleet[ind]))
  }
})
