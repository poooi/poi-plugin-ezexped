import {
  describeEReq,
  mkFleet,
  satisfied, notSatisfied,
} from './common'

import { FSLevel } from '../../../structs/ereq/fs-level'

describeEReq('FSLevel', () => {
  const f = FSLevel.prepare({level: 10})()
  notSatisfied(f, mkFleet(0))
  notSatisfied(f, mkFleet(1, () => ({level: 1})))
  satisfied(f, mkFleet(1, () => ({level: 10})))
  satisfied(f, mkFleet(1, () => ({level: 11})))
})
