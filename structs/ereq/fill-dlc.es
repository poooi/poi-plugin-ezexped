import { daihatsu } from '../../income-calc'

class FillDlc {
  static make = () => {}

  static prepare = () => () => (fleet, extra) => {
    const {normalBonus} = daihatsu.computeBonus(fleet.ships)
    return {
      sat: false,
      extra: 'TODO',
    }
  }
}

export { FillDlc }
