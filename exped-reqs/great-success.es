/*
   encode great success requirements
 */
import { mk } from './common'

const overdrumExpeds = {
  21: [
    mk.SparkledCount(4),
    mk.DrumCount(3+1),
  ],
  24: [
    mk.SparkledCount(4),
    mk.DrumCount(0+4),
  ],
  37: [
    mk.SparkledCount(4),
    mk.DrumCount(4+1),
  ],
  38: [
    mk.SparkledCount(4),
    mk.DrumCount(8+2),
  ],
  40: [
    mk.SparkledCount(4),
    mk.DrumCount(0+4),
  ],
  142: [
    mk.SparkledCount(4),
    mk.DrumCount(4+1),
  ],
}

const greatSuccessReq = id => {
  if (id === 101) {
    // GS requirement for A2
    // reference:
    // - 5DE, all sparkled:
    //   https://twitter.com/funny_kancolle/status/958682982616723460
    // - 3DD2DE, 4DD1DE, 5DD, all sparkled:
    //   https://twitter.com/ZBMBVCfcuCHSi55/status/930538185611886592
    // therefore I think it's safe to deduce that 5DD/DE should work.
    return [
      mk.FleetCompo({DDorDE: 5}),
      mk.AllSparkled(),
    ]
  }

  const reqs = overdrumExpeds[id]

  if (typeof reqs !== 'undefined')
    return reqs

  return [mk.SparkledCountCustom(), mk.AllSparkled()]
}

export { greatSuccessReq }
