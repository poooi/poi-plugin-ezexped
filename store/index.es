import _ from 'lodash'
import { modifyObject } from 'subtender'
import { store } from 'views/create-store'

import { defaultPState } from '../p-state'
import {
  subReducer as autoSwitchSubReducer,
} from './auto-switch'
import { asyncBoundActionCreator } from './action-creator'
import { debug } from '../debug'
import { expedNameToIdFuncSelector } from '../selectors'

const fleetChangeDebug = false

const initState = {
  ...defaultPState,

  expedTableExpanded: false,
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
    asyncBoundActionCreator(bac => {
      try {
        const expedName = action.body.api_quest_name
        const expedNameToId = expedNameToIdFuncSelector(store.getState())
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

export * from './action-creator'

export {
  initState,
  reducer,
}
