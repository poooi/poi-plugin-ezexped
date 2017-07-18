import {
  onFleetShips,
  singObj,
  mkShipList,
} from './common'

class Morale {
  static make = singObj('morale')

  static prepare = ({morale}) => () =>
    onFleetShips(ships => {
      const lowMoraleShips = ships.filter(s => s.morale < morale)
      return {
        sat: lowMoraleShips.length === 0,
        extra: mkShipList(lowMoraleShips),
      }
    })
}

export { Morale }
