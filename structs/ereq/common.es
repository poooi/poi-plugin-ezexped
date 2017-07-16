import _ from 'lodash'

const checkOk = (tooltip=null) => ({sat: true, tooltip})

// zoom in ships Array of a Fleet representation
const onFleetShips = f => fleet => f(fleet.ships)

// require flagship to present and zoom in on it
const requireFlagship = onFlagship =>
  onFleetShips(ships =>
    ships.length === 0 ?
      {sat: false, tooltip: 'emptyFleet'} :
      onFlagship(ships[0]))

// require x >= y and show some message if it's unmet
const requireGreaterOrEqual = (x,y) =>
  x >= y ?
    checkOk() :
    {sat: false, tooltip: `needs ${y-x} more`}

// wrapping a bool value to the expected format
const wrapBool = b => b ? checkOk() : {sat: false, tooltip: null}

const isEqpDrum = equip => equip.mstId === 75
const isShipSparkled = ship => ship.morale >= 50

const {sum} = _

export {
  checkOk,

  onFleetShips,
  requireFlagship,
  requireGreaterOrEqual,
  wrapBool,

  isEqpDrum,
  isShipSparkled,

  sum,
}
