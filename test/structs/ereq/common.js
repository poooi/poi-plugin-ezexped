import assert from 'assert'

import { enumFromTo } from '../../../utils'

const spec = it

const mkEquips = (...args) => args.map(mstId => ({mstId}))

const mkFleet = (shipCount, mkShip=() => {}) => {
  const ships =
    enumFromTo(0,shipCount-1).map(mkShip)
  return {ships}
}

const satisfied = (f, fleet) => assert(f(fleet).sat === true)
const notSatisfied = (f, fleet) => assert(f(fleet).sat === false)

const describeEReq = (name, f) =>
  describe(`EReq.${name}`, () => spec('tests', f))

export {
  describeEReq,
  mkEquips,
  mkFleet,

  satisfied,
  notSatisfied,
}
