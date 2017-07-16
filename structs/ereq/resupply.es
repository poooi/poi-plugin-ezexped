import {
  onFleetShips,
} from './common'

class Resupply {
  static prepare = () => () =>
    onFleetShips(ships => {
      const needSupShips = ships.filter(s => s.needResupply)
      return needSupShips.length > 0 ?
        {sat: false, tooltip: needSupShips} :
        {sat: true}
    })
}

export { Resupply }
