import { createSelector } from 'reselect'
import _ from 'lodash'

import {
  basicSelector,
  fleetShipsDataSelectorFactory,
  fleetShipsEquipDataSelectorFactory,
  fleetSelectorFactory,
} from 'views/utils/selectors'

import { enumFromTo } from 'subtender'
import { canEquipDLC } from 'subtender/kc'
import {
  hideMainFleetSelector,
  isMainFleetFuncSelector,
  selectedExpedsSelector,
  gsFlagsSelector,
  dlcFlagsSelector,
  fleetIdSelector,
} from './common'
import { debug } from '../debug'

const fleetNumberCountSelector = createSelector(
  basicSelector,
  basic => _.get(basic,'api_count_deck',4))

// get the sorted array of all api_id of openned fleets
const allFleetIdsSelector = createSelector(
  fleetNumberCountSelector,
  _.memoize(count => enumFromTo(1,count)))

const arrayOrUndef = x =>
  (Array.isArray(x) || typeof x === 'undefined') ?
    _.noop() :
    debug.error(`Expecting an Array or undefined value but get ${x}`)

const objOrUndef = x =>
  ((x !== null && typeof x === 'object') || typeof x === 'undefined') ?
    _.noop() :
    debug.error(`Expecting an Object or undefined value but get ${x}`)

const isExpedRelatedEquipment = mstId =>
  [75,68,166,167,193].includes(mstId)

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
const mkFleetInfo = (shipsData, equipsData, fleetData) => {
  arrayOrUndef(shipsData)
  arrayOrUndef(equipsData)
  objOrUndef(fleetData)

  if (!shipsData || !equipsData || !fleetData)
    return null

  const ships = shipsData.map(([ship, $ship], ind) => {
    const equips = _.compact(equipsData[ind])
      .map(([equipInst, $equip]) => ({
        mstId: $equip.api_id,
        rstId: equipInst.api_id,
        level: equipInst.api_level,
      }))
    const [[curAmmo, maxAmmo], [curFuel,maxFuel]] =
      [
        [ship.api_bull, $ship.api_bull_max],
        [ship.api_fuel, $ship.api_fuel_max],
      ]

    // assuming expedition-related items cannot be equipped in extra slots,
    // we only care about normal slots
    const normalSlotCount = $ship.api_slot_num
    const occupiedNormalSlotCount =
      equips.filter(e => isExpedRelatedEquipment(e.mstId)).length
    // how many more DLC-class equipment can this ship carry?
    const extraDlcCapability =
      canEquipDLC($ship.api_stype, $ship.api_id) ?
        Math.max(
          normalSlotCount - occupiedNormalSlotCount,
          /*
             this should never happen as long as expedition-related
             cannot be equipped in ex-slot, but just in case.
           */
          0
        ) : 0

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
      extraDlcCapability,
    }
  })

  const normalizeExpedId = v =>
    _.isInteger(v) && v >= 1 && v <= 40 ? v : null

  return {
    id: fleetData.api_id,
    name: fleetData.api_name,
    available: fleetData.api_mission[0] === 0,
    duringExpedId: normalizeExpedId(fleetData.api_mission[1]),
    ships,
  }
}

// 1 <= fleetId <= 4
const mkFleetInfoSelector = _.memoize(fleetId => {
  const fleetInd = fleetId-1
  return createSelector(
    fleetShipsDataSelectorFactory(fleetInd),
    fleetShipsEquipDataSelectorFactory(fleetInd),
    fleetSelectorFactory(fleetInd),
    mkFleetInfo)
})

const indexedFleetsInfoSelector = createSelector(
  [1,2,3,4].map(mkFleetInfoSelector),
  (...fleets) => _.keyBy(fleets,'id'))

/*
   if user choose to hide the main fleet while main fleet is selected,
   instead of actually hiding it, we place an indicator on it
   and hide main fleet after having switched to other fleet.
 */
const visibleFleetIdsSelector = createSelector(
  allFleetIdsSelector,
  hideMainFleetSelector,
  isMainFleetFuncSelector,
  fleetIdSelector,
  (allFleetIds, hideMainFleet, isMainFleetFunc, currentFleetId) =>
    allFleetIds.filter(fleetId => {
      // bypassing visibility check if current fleet is the selected one
      if (fleetId === currentFleetId)
        return true
      if (!hideMainFleet)
        return true
      return !isMainFleetFunc(fleetId)
    }))

const visibleFleetsInfoSelector = createSelector(
  indexedFleetsInfoSelector,
  visibleFleetIdsSelector,
  (indexedFleetsInfo,visibleFleetIds) =>
    visibleFleetIds.map(fleetId =>
      indexedFleetsInfo[fleetId]))

const expedIdSelectorForFleet = _.memoize(fleetId =>
  createSelector(
    selectedExpedsSelector,
    selectedExpeds => selectedExpeds[fleetId]))

const gsFlagSelectorForFleet = _.memoize(fleetId =>
  createSelector(
    gsFlagsSelector,
    expedIdSelectorForFleet(fleetId),
    (gsFlags,expedId) => gsFlags[expedId]))

const dlcFlagSelectorForFleet = _.memoize(fleetId =>
  createSelector(
    dlcFlagsSelector,
    expedIdSelectorForFleet(fleetId),
    (dlcFlags,expedId) => dlcFlags[expedId]))

// the expedition selected for current focusing fleet
const expedIdSelector = createSelector(
  selectedExpedsSelector,
  fleetIdSelector,
  (selectedExpeds,fleetId) => selectedExpeds[fleetId])

const gsFlagSelector = createSelector(
  gsFlagsSelector,
  expedIdSelector,
  (gsFlags,expedId) => gsFlags[expedId])

const dlcFlagSelector = createSelector(
  dlcFlagsSelector,
  expedIdSelector,
  (dlcFlags,expedId) => dlcFlags[expedId])

const fleetInfoSelector = createSelector(
  indexedFleetsInfoSelector,
  fleetIdSelector,
  (indexedFleetsInfo,fleetId) => indexedFleetsInfo[fleetId])

export {
  allFleetIdsSelector,
  mkFleetInfoSelector,
  indexedFleetsInfoSelector,

  visibleFleetIdsSelector,
  visibleFleetsInfoSelector,

  expedIdSelector,
  gsFlagSelector,
  dlcFlagSelector,
  fleetInfoSelector,

  expedIdSelectorForFleet,
  gsFlagSelectorForFleet,
  dlcFlagSelectorForFleet,
}
