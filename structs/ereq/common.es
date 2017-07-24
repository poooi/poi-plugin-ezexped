import _ from 'lodash'
import { singObj } from 'subtender'

const checkOk = (extra={}) => ({sat: true, extra})

// zoom in ships Array of a Fleet representation
const onFleetShips = f => fleet => f(fleet.ships)

// require flagship to present and zoom in on it
const requireFlagship = onFlagship =>
  onFleetShips(ships =>
    ships.length === 0 ?
      {sat: false, extra: {type: 'NoFlagship'}} :
      onFlagship(ships[0]))

// require x >= y and show some message if it's unmet
const requireGreaterOrEqual = (x,y) =>
  x >= y ?
    checkOk() :
    {sat: false, extra: {type: 'GreaterOrEqual', left: x, right: y}}

// wrapping a bool value to the expected format
const wrapBool = b => b ? checkOk() : {sat: false, extra: {}}

const isEqpDrum = equip => equip.mstId === 75
const isShipSparkled = ship => ship.morale >= 50

const {sum} = _

const mkShipList = shipList => ({type: 'ShipList', shipList})

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
  mkShipList,
}
