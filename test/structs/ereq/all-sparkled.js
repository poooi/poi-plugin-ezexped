import {
  describeEReq,
  mkFleet,
  satisfied, notSatisfied,
} from './common'

import { AllSparkled } from '../../../structs/ereq/all-sparkled'

describeEReq('AllSparkled', () => {
  const fleet = [
    {morale: 50},
    {morale: 50},
    {morale: 40},
    {morale: 100},
  ]
  const f = AllSparkled.prepare()()
  satisfied(f, mkFleet(1, ind => fleet[ind]))
  satisfied(f, mkFleet(2, ind => fleet[ind]))
  notSatisfied(f, mkFleet(3, ind => fleet[ind]))
  notSatisfied(f, mkFleet(4, ind => fleet[ind]))
})
