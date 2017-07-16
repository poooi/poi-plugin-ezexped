import {
  describeEReq,
  mkEquips, mkFleet,
  satisfied, notSatisfied,
} from './common'

import { DrumCount } from '../../../structs/ereq/drum-count'

describeEReq('DrumCount', () => {
  const fleet = [
    {equips: mkEquips(75)},
    {equips: mkEquips()},
    {equips: mkEquips(75)},
    {equips: mkEquips(75,75)},
  ]
  {
    const f = DrumCount.prepare({count: 2})()
    notSatisfied(f, mkFleet(1, ind => fleet[ind]))
    notSatisfied(f, mkFleet(2, ind => fleet[ind]))
    satisfied(f, mkFleet(3, ind => fleet[ind]))
  }
  {
    const f = DrumCount.prepare({count: 4})()
    notSatisfied(f, mkFleet(3, ind => fleet[ind]))
    satisfied(f, mkFleet(4, ind => fleet[ind]))
  }
})
