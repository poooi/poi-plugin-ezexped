import {
  describeEReq,
  mkFleet,
  satisfied, notSatisfied,
} from './common'

import { SparkledCountCustom } from '../../../structs/ereq/sparkled-count-custom'

describeEReq('SparkledCountCustom', () => {
  const fleet = [
    {morale: 41},
    {morale: 51},
    {morale: 52},
  ]
  {
    const f = SparkledCountCustom.prepare({})({sparkledCount: 1})
    notSatisfied(f, mkFleet(1, ind => fleet[ind]))
    satisfied(f, mkFleet(2, ind => fleet[ind]))
  }

  {
    const f = SparkledCountCustom.prepare({})({sparkledCount: 2})
    notSatisfied(f, mkFleet(2, ind => fleet[ind]))
    satisfied(f, mkFleet(3, ind => fleet[ind]))
  }
})
