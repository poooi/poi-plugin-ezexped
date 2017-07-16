import {
  describeEReq,
  mkFleet,
  satisfied, notSatisfied,
} from './common'

import { Resupply } from '../../../structs/ereq/resupply'

describeEReq('Resupply', () => {
  const fleet = [
    {needResupply: false},
    {needResupply: false},
    {needResupply: true},
  ]
  const f = Resupply.prepare()()
  satisfied(f, mkFleet(1, ind => fleet[ind]))
  satisfied(f, mkFleet(2, ind => fleet[ind]))
  notSatisfied(f, mkFleet(3, ind => fleet[ind]))
})
