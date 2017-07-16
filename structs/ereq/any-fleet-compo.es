import { onFleetShips } from './common'
import { countFleetCompo } from '../../estype'

class AnyFleetCompo {
  static prepare = ({compos}) => () =>
    onFleetShips(ships => {
      const results = compos.map(compo => {
        const countedCompo = countFleetCompo(compo)(ships)
        const sat = Object.entries(compo).every(([estype,count]) =>
          countedCompo[estype] >= count)
        return {countedCompo, sat}
      })
      const sat = results.some(x => x.sat)
      return {sat, tooltip: results}
    })
}

export { AnyFleetCompo }
