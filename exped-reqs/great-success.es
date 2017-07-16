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
}

const greatSuccessReq = id => {
  const reqs = overdrumExpeds[id]

  if (typeof reqs !== 'undefined')
    return reqs

  return [mk.SparkledCountCustom(), mk.AllSparkled()]
}

export { greatSuccessReq }
