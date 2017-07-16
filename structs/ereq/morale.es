import {
  onFleetShips,
} from './common'

class Morale {
  static prepare = ({morale}) => () =>
    onFleetShips(ships => {
      const lowMoraleShips = ships.filter(s => s.morale < morale)
      return lowMoraleShips.length > 0 ?
        {sat: false, tooltip: lowMoraleShips} :
        {sat: true}
    })
}

export { Morale }
