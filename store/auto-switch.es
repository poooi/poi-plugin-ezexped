/*

   new in-game action-based auto switch mechanism without guesswork

 */
import _ from 'lodash'
import { store } from 'views/create-store'

import { mapDispatchToProps } from './action-creator'
import {
  hideMainFleetSelector,
  visibleFleetIdsSelector,
  visibleFleetsInfoSelector,
  nextAvailableFleetIdSelector,
} from '../selectors'

const asyncChangeFleet = (...args) =>
  store.dispatch(dispatch => setTimeout(() =>
    mapDispatchToProps(dispatch).changeFleet(...args)))

// parse a **positive** number from perhaps string, returns null on failure
// this works on both fleetId and ship's rosterId because both starts from 1
const parseRawNum = raw => Number(raw) || null

// extract fleet id from actions that we are interested in
const fleetIdFromAction = action => {
  // handle game actions on fleet members
  if (action.type === '@@Request/kcsapi/api_req_hensei/change') {
    return parseRawNum(_.get(action,'body.api_id'))
  }

  if (action.type === '@@Request/kcsapi/api_req_hensei/preset_select') {
    return parseRawNum(_.get(action,'body.api_deck_id'))
  }
  return null
}

// extract ship roster id from actions that we are interested in
const shipRosterIdFromAction = action => {
  if (
    action.type === '@@Request/kcsapi/api_req_kaisou/slotset' ||
    action.type === '@@Request/kcsapi/api_req_kaisou/unsetslot_all' ||
    action.type === '@@Request/kcsapi/api_req_kaisou/slotset_ex' ||
    action.type === '@@Request/kcsapi/api_req_kaisou/slot_exchange_index'
  ) {
    return parseRawNum(_.get(action,'body.api_id'))
  }

  if (
    action.type === '@@Request/kcsapi/api_req_kaisou/slot_deprive'
  ) {
    return parseRawNum(_.get(action,'body.api_set_ship'))
  }
  return null
}

// let's coin "subReducer" to mean an almost-reducer,
// which is guaranteed to receive non-undefined state values
// and doesn't require to provide a default one.
const subReducer = (state, action) => {
  /*
     the following two actions are intentionally not handled by this sub-reducer:

     - action.type === '@@Request/kcsapi/api_req_mission/start'
     - action.type === '@@Response/kcsapi/api_req_mission/start'

     this is because at the moment when fleet is just sent out,
     we don't have enough time to allow the availabilty change of fleets
     a more reliable way is to observe 'nextAvailableFleet' and change fleet
     accordingly.

     the mechanism described above is implemented in ../observers/next-fleet.es

   */

  if (
    // the user is entering expedition screen
    action.type === '@@Request/kcsapi/api_get_member/mission'
  ) {
    const reason = `triggered by game action ${action.type}`
    const poiState = store.getState()
    const mayFleetId = nextAvailableFleetIdSelector(poiState)
    if (typeof mayFleetId === 'number') {
      const fleetId = mayFleetId
      asyncChangeFleet(fleetId, reason)
    } else {
      const hideMainFleet = hideMainFleetSelector(poiState)
      if (! hideMainFleet) {
        asyncChangeFleet(1, `${reason} (main)`)
      }
    }
    return state
  }

  // handle game actions on fleet members
  {
    const mayFleetId = fleetIdFromAction(action)
    if (mayFleetId && typeof mayFleetId === 'number') {
      const fleetId = mayFleetId
      const poiState = store.getState()
      const visibleFleetIds = visibleFleetIdsSelector(poiState)
      // only consider changes in visible fleets
      if (visibleFleetIds.includes(fleetId))
        asyncChangeFleet(fleetId, 'fleet compo changed')

      return state
    }
  }

  // handle game actions on equipments of (maybe) fleet members
  {
    const mayShipRstId = shipRosterIdFromAction(action)
    if (mayShipRstId && typeof mayShipRstId === 'number') {
      const shipRstId = mayShipRstId
      const poiState = store.getState()
      const visibleFleetsInfo = visibleFleetsInfoSelector(poiState)
      const fleetInfoInd = visibleFleetsInfo.findIndex(fi =>
        fi.ships.findIndex(s => s.rstId === shipRstId) !== -1)

      if (fleetInfoInd !== -1) {
        const fleetInfo = visibleFleetsInfo[fleetInfoInd]
        asyncChangeFleet(fleetInfo.id, 'fleet member eqp changed')
      }

      return state
    }
  }

  return state
}

export {
  subReducer,
}
