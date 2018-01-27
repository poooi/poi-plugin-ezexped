import _ from 'lodash'
import { enumFromTo, modifyObject } from 'subtender'
import { store } from 'views/create-store'

import {
  subReducer as autoSwitchSubReducer,
} from './auto-switch'
import { asyncBoundActionCreators } from './action-creators'
import { debug } from '../debug'
import { expedNameToIdFuncSelector, cqcSelector } from '../selectors'
import { recordFailure } from './failure-report'

const fleetChangeDebug = false

const initState = {
  fleetAutoSwitch: true,
  hideMainFleet: false,
  hideSatReqs: false,
  sparkledCount: 6,
  syncMainFleetId: false,
  fleetId: 1,
  // an Object from expedId to bool, default to false
  gsFlags: {},
  selectedExpeds: _.fromPairs(
    enumFromTo(1,4).map(fleetId => [fleetId, 1])),
  // an Object from expedId to bool, default to true
  dlcFlags: {},
  expedTableExpanded: false,

  kanceptsExportShipList: true,
  /*
     indicates where to locate kancepts,
     this could be 'github' or 'kcwiki'
   */
  kanceptsUrl: 'github',

  ready: false,
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-ezexped@PStateReady') {
    const {pState} = action
    return {
      ...state,
      ...pState,
      ready: true,
    }
  }

  // all other actions requires the state to be ready
  if (!state.ready)
    return state

  if (action.type === '@poi-plugin-ezexped@ModifyState') {
    const {modifier} = action
    return modifier(state)
  }

  if (action.type === '@poi-plugin-ezexped@ChangeFleet') {
    if (fleetChangeDebug && action.reason)
      debug.log(`changeFleet for reason: ${action.reason}`)

    return modifyObject(
      'fleetId', () => action.fleetId)(state)
  }

  if (action.type === '@@Response/kcsapi/api_req_mission/result') {
    // get an async action to figure out the exped
    asyncBoundActionCreators(bac => {
      try {
        const newState = store.getState()
        const expedName = action.body.api_quest_name
        const expedNameToId = expedNameToIdFuncSelector(newState)
        const expedId = expedNameToId(expedName)
        if (!_.isInteger(expedId))
          throw new Error(`cannot find expedition with name ${expedName}`)
        const fleetId = parseInt(action.postBody.api_deck_id, 10)

        const modifiers = [
          // only record successful expeditions
          action.body.api_clear_result !== 0 &&
          modifyObject(
            'selectedExpeds',
            modifyObject(
              fleetId, () => expedId)),
          // switch to the corresponding fleet on expedition result screen
          // if "fleetAutoSwitch" is on
          state.fleetAutoSwitch &&
          modifyObject(
            'fleetId', () => fleetId),
        ]
        bac.modifyState(_.flow(_.compact(modifiers)))

        /*
           record failure report upon expedition failure

           we could have checked against encoded checkers
           but that would make things unnessarily complicated
           (e.g. should we ignore MissingInfo and in general missing expeds)
           so here we just record failed expeditions regardless of
           what our checker has said.

         */
        if (action.body.api_clear_result === 0) {
          const cqc = cqcSelector(newState)
          recordFailure(action.body, cqc, Number(action.time))
        }
      } catch (e) {
        debug.error(`failed to record a successful exped ${e}`)
      }
    })

    return state
  }

  if (state.fleetAutoSwitch) {
    return autoSwitchSubReducer(state,action)
  } else {
    return state
  }
}

export * from './action-creators'

export {
  initState,
  reducer,
}
