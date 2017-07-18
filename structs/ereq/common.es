import _ from 'lodash'

const checkOk = (extra=null) => ({sat: true, extra})

// zoom in ships Array of a Fleet representation
const onFleetShips = f => fleet => f(fleet.ships)

// require flagship to present and zoom in on it
const requireFlagship = onFlagship =>
  onFleetShips(ships =>
    ships.length === 0 ?
      {sat: false, extra: 'emptyFleet'} :
      onFlagship(ships[0]))

// require x >= y and show some message if it's unmet
const requireGreaterOrEqual = (x,y) =>
  x >= y ?
    checkOk() :
    {sat: false, extra: `needs ${y-x} more`}

// wrapping a bool value to the expected format
const wrapBool = b => b ? checkOk() : {sat: false, extra: null}

const isEqpDrum = equip => equip.mstId === 75
const isShipSparkled = ship => ship.morale >= 50

const {sum} = _

// create singleton object
const singObj = propName => v => ({[propName]: v})

export {
  checkOk,

  onFleetShips,
  requireFlagship,
  requireGreaterOrEqual,
  wrapBool,

  isEqpDrum,
  isShipSparkled,

  sum,
  singObj,
}
