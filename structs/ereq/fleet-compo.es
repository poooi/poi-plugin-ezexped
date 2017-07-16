import { onFleetShips } from './common'
import { countFleetCompo } from '../../estype'

class FleetCompo {
  static prepare = ({compo}) => () =>
    onFleetShips(ships => {
      const countedCompo = countFleetCompo(compo)(ships)
      const sat = Object.entries(compo).every(([estype,count]) =>
        countedCompo[estype] >= count)
      return {sat, tooltip: countedCompo}
    })
}

export { FleetCompo }
