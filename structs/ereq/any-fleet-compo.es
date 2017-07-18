import { onFleetShips, singObj } from './common'

import { computeResult } from './fleet-compo'

class AnyFleetCompo {
  static make = singObj('compos')

  static prepare = ({compos}) => {
    const fs = compos.map(computeResult)
    return () => onFleetShips(ships => {
      const results = fs.map(f => f(ships))
      const sat = results.some(r => r.sat)
      return {sat, extra: {type: 'AnyFleetCompo', results}}
    })
  }
}

export { AnyFleetCompo }
