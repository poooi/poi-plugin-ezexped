import {
  describeEReq,
  mkFleet,
  notSatisfied, satisfied,
} from './common'
import { FSType } from '../../../structs/ereq/fs-type'
import { stype } from '../../../estype'

describeEReq('FSType', () => {
  {
    const f = FSType.prepare({estype: 'CVLike'})()

    notSatisfied(f, mkFleet(1, () => ({stype: stype.DD})))
    notSatisfied(f, mkFleet(1, () => ({stype: stype.CL})))
    satisfied(f, mkFleet(1, () => ({stype: stype.AV})))
    satisfied(f, mkFleet(1, () => ({stype: stype.CVL})))
  }

  {
    const f = FSType.prepare({estype: 'CVE'})()
    notSatisfied(f, mkFleet(1, () => ({stype: stype.CVL, mstId: 318})))
    satisfied(f, mkFleet(1, () => ({stype: stype.CVL, mstId: 380})))
  }
})
