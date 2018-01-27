import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  extensionSelectorFactory,
  sortieSelector,
  wctfSelector,
} from 'views/utils/selectors'

import { initState } from '../store'

const isFleetCombinedSelector =
  createSelector(
    sortieSelector,
    sortie => sortie.combinedFlag !== 0)

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-ezexped'),
  ext => _.isEmpty(ext) ? initState : ext)

/*
   if we need to load some parts of the state with dynamic propNames,
   we can use this function so selectors accessing the store with same propNames
   are never re-created
 */
const mkExtPropSelector = _.memoize(propName =>
  createSelector(extSelector, ext => ext[propName]))

const fleetAutoSwitchSelector =
  mkExtPropSelector('fleetAutoSwitch')
const hideMainFleetSelector =
  mkExtPropSelector('hideMainFleet')
const hideSatReqsSelector =
  mkExtPropSelector('hideSatReqs')
const sparkledCountSelector =
  mkExtPropSelector('sparkledCount')
const syncMainFleetIdSelector =
  mkExtPropSelector('syncMainFleetId')
const fleetIdSelector =
  mkExtPropSelector('fleetId')
const gsFlagsSelector =
  mkExtPropSelector('gsFlags')
const selectedExpedsSelector =
  mkExtPropSelector('selectedExpeds')
const dlcFlagsSelector =
  mkExtPropSelector('dlcFlags')
const expedTableExpandedSelector =
  mkExtPropSelector('expedTableExpanded')
const kanceptsExportShipListSelector =
  mkExtPropSelector('kanceptsExportShipList')
const readySelector =
  mkExtPropSelector('ready')

const isMainFleetFuncSelector = createSelector(
  isFleetCombinedSelector,
  isFleetCombined =>
    isFleetCombined ?
      (fleetId => fleetId <= 2) :
      (fleetId => fleetId === 1)
)

/*
   returns a function:

   canEquip(equipMstId: int)(shipMstId: int): bool or null

   - curried in such a way to allow parametrizing on equipment id.

   - returning `null` means failure - it could be the case
     when either equipMstId or shipMstId is not found
   - returning a bool to indicate if it's possible to equip <equipMstId> on ship <shipMstId>

 */
const canEquipFuncSelector = createSelector(
  wctfSelector,
  w => equipMstId => {
    const eqpInfo = _.get(w, ['items', equipMstId])

    if (_.isEmpty(eqpInfo))
      return _shipMstId => null

    return shipMstId => {
      const shipInfo = _.get(w, ['ships', shipMstId])
      if (_.isEmpty(shipInfo))
        return null

      const eqpTypeInfo = _.get(w, ['item_types', eqpInfo.type])
      /* eslint-disable camelcase */
      const {
        equipable_extra_ship = [],
        equipable_on_type,
      } = eqpTypeInfo
      /* eslint-enable camelcase */
      return equipable_on_type.includes(shipInfo.type) ||
        equipable_extra_ship.includes(shipMstId)
    }
  }
)

const canEquipDLCFuncSelector = createSelector(
  canEquipFuncSelector,
  canEquip => _.memoize(canEquip(68 /* 大発動艇 */))
)

export {
  mkExtPropSelector,

  isFleetCombinedSelector,

  extSelector,

  fleetAutoSwitchSelector,
  hideMainFleetSelector,
  hideSatReqsSelector,
  sparkledCountSelector,
  syncMainFleetIdSelector,
  fleetIdSelector,
  gsFlagsSelector,
  selectedExpedsSelector,
  dlcFlagsSelector,
  expedTableExpandedSelector,
  kanceptsExportShipListSelector,
  readySelector,

  isMainFleetFuncSelector,
  canEquipDLCFuncSelector,
}
