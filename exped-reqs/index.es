import { defineWorld1 } from './world-1'
import { defineWorld2 } from './world-2'
import { defineWorld3 } from './world-3'
import { defineWorld4 } from './world-4'
import { defineWorld5 } from './world-5'

import { mk } from './common'
import { greatSuccessReq } from './great-success'

const expedReqs = new Array(1+40)

const defineExped = id => (norm,gs = greatSuccessReq(id)) => {
  const resupply = mk.Resupply()
  expedReqs[id] = {id,norm,gs,resupply}
}

defineWorld1(defineExped)
defineWorld2(defineExped)
defineWorld3(defineExped)
defineWorld4(defineExped)
defineWorld5(defineExped)
