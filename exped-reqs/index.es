import { defineWorld1 } from './world-1'
import { defineWorld2 } from './world-2'
import { defineWorld3 } from './world-3'
import { defineWorld4 } from './world-4'
import { defineWorld5 } from './world-5'
import { defineWorld7 } from './world-7'

import { mk } from './common'
import { EReq } from '../structs/ereq'
import { greatSuccessReq } from './great-success'

const expedReqs = {}

const mapExpedReq = f => reqObj => {
  const {norm, gs, resupply, dlc} = reqObj
  return {
    ...reqObj,
    norm: norm.map(f),
    gs: gs.map(f),
    resupply: f(resupply),
    dlc: f(dlc),
  }
}

const defineExped = id => (norm,gs = greatSuccessReq(id)) => {
  const resupply = mk.Resupply()
  const dlc = mk.FillDlc()
  expedReqs[id] = mapExpedReq(EReq.performStage1)({id,norm,gs,resupply,dlc})
}

// when we cannot find an expedition, "missing" should be used instead
defineExped('missing')([mk.MissingInfo()])

defineWorld1(defineExped)
defineWorld2(defineExped)
defineWorld3(defineExped)
defineWorld4(defineExped)
defineWorld5(defineExped)
defineWorld7(defineExped)

export { expedReqs, mapExpedReq }
