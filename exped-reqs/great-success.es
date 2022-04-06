/*
   encode great success requirements
 */
import { mk } from './common'

const overdrumExpeds = {
  21: [
    mk.GSRateDrum(3,4),
    mk.DrumCount(3+1),
  ],
  24: [
    mk.GSRateDrum(0,2),
    mk.DrumCount(0+2),
  ],
  37: [
    mk.GSRateDrum(4,5),
    mk.DrumCount(4+1),
  ],
  38: [
    mk.GSRateDrum(8,10),
    mk.DrumCount(8+2),
  ],
  40: [
    mk.GSRateDrum(0,4),
    mk.DrumCount(0+4),
  ],
  44: [
    mk.GSRateDrum(6,8),
    mk.DrumCount(6+2),
  ],
  142: [
    mk.GSRateDrum(4,6),
    mk.DrumCount(4+2),
  ],
}

const flagShipExpeds = [101, 102, 103, 104, 105, 112, 113, 114, 115, 41, 43, 45, 46, 32, 131, 132, 133, 141]

const greatSuccessReq = id => {
  
  const reqs = overdrumExpeds[id]

  if (typeof reqs !== 'undefined')
    return reqs

  if (flagShipExpeds.indexOf(id) > -1)
    return [mk.GSRateFlag(), mk.GSHigherLevel()]

  return [mk.GSRateNorm(), mk.AllSparkled()]
}

export { greatSuccessReq }
