import {
  describeEReq,
  mkFleet,
  satisfied, notSatisfied,
} from './common'

import { SparkledCount } from '../../../structs/ereq/sparkled-count'

describeEReq('SparkledCount', () => {
  const fleet = [
    {morale: 41},
    {morale: 51},
    {morale: 52},
  ]
  const f = SparkledCount.prepare({count: 2})()

  notSatisfied(f, mkFleet(1, ind => fleet[ind]))
  notSatisfied(f, mkFleet(2, ind => fleet[ind]))
  satisfied(f, mkFleet(3, ind => fleet[ind]))
})
