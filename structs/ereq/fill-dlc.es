import { daihatsu } from '../../income-calc'
import { checkOk } from './common'

class FillDlc {
  static make = () => {}

  static prepare = () => () => (fleet, {spareEquips}) => {
    // no spare equipment to be considered
    if (!spareEquips[68] && !spareEquips[193])
      return checkOk()

    const {normalBonus} = daihatsu.computeBonus(fleet.ships)
    // we have reached DLC-class bonus cap, no point adding more.
    if (normalBonus >= 0.2)
      return checkOk()

    // ships that can equip more DLCs
    const extraDlcCapableShips = fleet.ships.filter(s =>
      s.extraDlcCapability > 0)

    // fleet cannot carry any more DLCs
    if (extraDlcCapableShips.length === 0)
      return checkOk()
    return {
      sat: false,
      extra: {
        type: 'FillDlc',
        ships: extraDlcCapableShips,
      },
    }
  }
}

export { FillDlc }
