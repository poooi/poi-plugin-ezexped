import {
  describeEReq,
  mkFleet,
  satisfied, notSatisfied,
} from './common'

import { ShipCount } from '../../../structs/ereq/ship-count'

describeEReq('ShipCount', () => {
  const f = ShipCount.prepare({count: 4})()

  notSatisfied(f, mkFleet(3, () => {}))
  satisfied(f, mkFleet(4, () => {}))
})
