import {
  onFleetShips,
  singObj,
} from './common'

class Morale {
  static make = singObj('morale')

  static prepare = ({morale}) => () =>
    onFleetShips(ships => {
      const lowMoraleShips = ships.filter(s => s.morale < morale)
      return lowMoraleShips.length > 0 ?
        {sat: false, extra: lowMoraleShips} :
        {sat: true}
    })
}

export { Morale }
