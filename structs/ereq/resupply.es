import {
  onFleetShips,
  mkShipList,
} from './common'

class Resupply {
  static make = () => {}

  static prepare = () => () =>
    onFleetShips(ships => {
      const needSupShips = ships.filter(s => s.needResupply)
      return {
        sat: needSupShips.length === 0,
        extra: mkShipList(needSupShips),
      }
    })
}

export { Resupply }
