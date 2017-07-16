import {
  describeEReq,
  mkEquips, mkFleet,
  satisfied, notSatisfied,
} from './common'

import { DrumCarrierCount } from '../../../structs/ereq/drum-carrier-count'

describeEReq('DrumCarrierCount', () => {
  const fleet = [
    {equips: mkEquips(75)},
    {equips: mkEquips()},
    {equips: mkEquips(75,75)},
    {equips: mkEquips(75)},
  ]

  const f = DrumCarrierCount.prepare({count: 2})()
  notSatisfied(f, mkFleet(1, ind => fleet[ind]))
  notSatisfied(f, mkFleet(2, ind => fleet[ind]))
  satisfied(f, mkFleet(3, ind => fleet[ind]))
  satisfied(f, mkFleet(4, ind => fleet[ind]))
})
