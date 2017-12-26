import _ from 'lodash'
import { createSelector } from 'reselect'

import {
  constSelector,
  equipsSelector,
  shipsSelector,
  fleetsSelector,
  basicSelector,
} from 'views/utils/selectors'

const equipInfoFuncSelector = createSelector(
  constSelector,
  equipsSelector,
  ({$equips},equips) => _.memoize(
    rstId => {
      if (!_.isInteger(rstId) || rstId <= 0)
        return null
      const equip = equips[rstId]
      if (!equip)
        return null
      const mstId = equip.api_slotitem_id
      const $equip = $equips[mstId]
      return {
        mstId,
        rstId,
        ace: _.get(equip,'api_alv',null),
        imp: equip.api_level,
        // Info only:
        name: $equip.api_name,
        iconId: $equip.api_type[3],
      }
    }
  )
)

const shipInfoFuncSelector = createSelector(
  constSelector,
  shipsSelector,
  equipInfoFuncSelector,
  ({$ships}, ships, equipInfoFunc) => _.memoize(
    rstId => {
      if (!_.isInteger(rstId) || rstId <= 0)
        return null
      const ship = ships[rstId]
      if (!ship)
        return null
      const mstId = ship.api_ship_id
      const $ship = $ships[mstId]
      const luck = ship.api_lucky[0]
      if (!$ship)
        return null
      return {
        mstId,
        rstId,
        level: ship.api_lv,
        luck,
        aswE: ship.api_taisen[0],
        hp: ship.api_maxhp,
        slots: _.compact(ship.api_slot.map(equipInfoFunc)),
        exSlot: equipInfoFunc(ship.api_slot_ex),
      }
    }
  )
)

const fleetInfoFuncSelector = createSelector(
  fleetsSelector,
  shipInfoFuncSelector,
  (fleets, shipInfoFunc) => _.memoize(
    fleetId => {
      const rawFleet = fleets.find(x => x.api_id === fleetId)
      if (
        !rawFleet ||
        // not valid raw fleet
        !('api_name' in rawFleet) ||
        !('api_ship' in rawFleet) ||
        // api_ship = -1 (no fleet member)
        !Array.isArray(rawFleet.api_ship) ||
        // all members are invalid
        rawFleet.api_ship.every(id => id <= 0)
      ) {
        return null
      }
      const shipIds =
        rawFleet.api_ship.filter(rId => rId > 0)
      return {
        name: rawFleet.api_name,
        ships: shipIds.map(shipInfoFunc),
      }
    }
  )
)

const cqcSelector = createSelector(
  fleetInfoFuncSelector,
  basicSelector,
  (fleetInfoFunc, basic) => ({
    version: '0.0.1',
    hqLevel: _.isInteger(basic.api_level) ? basic.api_level : null,
    fleets: _.compact([1,2,3,4].map(fleetInfoFunc)),
  })
)

export {
  cqcSelector,
}
