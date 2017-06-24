import { createSelector } from 'reselect'
import { _ } from 'lodash'

import {
  fleetShipsDataSelectorFactory,
  fleetShipsEquipDataSelectorFactory,
  fleetSelectorFactory,
  extensionSelectorFactory,
  sortieSelector,
  configSelector,
} from 'views/utils/selectors'

import { ezconfigs } from './ezconfig'
import { error } from './utils'

const arrayOrUndef = x =>
  (Array.isArray(x) || typeof x === 'undefined') ?
    _.noop() :
    error(`Expecting an Array or undefined value but get ${x}`)

const objOrUndef = x =>
  ((x !== null && typeof x === 'object') || typeof x === 'undefined') ?
    _.noop() :
    error(`Expecting an Object or undefined value but get ${x}`)


/*

reorganize data, shape it to form the basic input structure
of other functions.

CONTRACT:
 - shipsData is either an array or undefined
 - equipsData is either an array or undefined
 - fleetData is either an object or undefined
 for all inputs above, undefined is used only when the fleet in question
 is not yet unlocked in game.

returns a fleet representation when the fleet can be found, "null" otherwise.

*/
const mkFleetInfo = fleetId => (shipsData, equipsData, fleetData) => {
  arrayOrUndef(shipsData)
  arrayOrUndef(equipsData)
  objOrUndef(fleetData)

  if (!shipsData || !equipsData || !fleetData)
    return null

  const ships = shipsData.map( ([ship, $ship], ind) => {
    const equips = _.compact(equipsData[ind])
      .map( ([equipInst, $equip]) => ({
        mstId: $equip.api_id,
        rstId: equipInst.api_id,
        level: equipInst.api_level,
      }))
    const [[curAmmo, maxAmmo], [curFuel,maxFuel]] =
      [[ship.api_bull, $ship.api_bull_max],
       [ship.api_fuel, $ship.api_fuel_max]]
    return {
      mstId: $ship.api_id,
      // roster ID of current ship
      rstId: ship.api_id,
      name: $ship.api_name,
      equips,
      level: ship.api_lv,
      morale: ship.api_cond,
      maxAmmo, maxFuel,
      needResupply: curAmmo !== maxAmmo || curFuel !== maxFuel,
      stype: $ship.api_stype,
    }
  })
  return {
    index: fleetId,
    name: fleetData.api_name,
    available: fleetData.api_mission[0] === 0,
    ships,
  }
}

// 0 <= fleetId <= 3
const mkFleetInfoSelector = fleetId =>
  createSelector(
    fleetShipsDataSelectorFactory(fleetId),
    fleetShipsEquipDataSelectorFactory(fleetId),
    fleetSelectorFactory(fleetId),
    mkFleetInfo(fleetId))

const isFleetCombinedSelector =
  createSelector(
    sortieSelector,
    sortie => sortie.combinedFlag !== 0)

const reduxSelector =
  extensionSelectorFactory('poi-plugin-ezexped')

const ezconfigSelector = createSelector(
  configSelector,
  config => _.fromPairs(Object.entries(ezconfigs).map( ([confKey, conf]) => {
    // get the current config value,
    // or a function that generates a default config value
    // we intentionally want to delay the creation of a default config value
    // unless it's necessary
    const valOrFunc = _.get(config,conf.path, conf.getDefault)
    const val = valOrFunc === conf.getDefault ? valOrFunc() : valOrFunc
    return [confKey, val]
  })))

export {
  mkFleetInfoSelector,
  isFleetCombinedSelector,
  ezconfigSelector,
  reduxSelector,
}
