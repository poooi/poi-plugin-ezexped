import _ from 'lodash'
import { modifyObject } from 'subtender'

import { expedNameToId } from '../exped-info'
import { defaultConfig } from '../config'
import {
  subReducer as autoSwitchSubReducer,
} from './auto-switch'
import { debug } from '../debug'

const fleetChangeDebug = false

const initState = {
  ...defaultConfig,

  expedTableExpanded: false,
  ready: false,
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-ezexped@ConfigReady') {
    const {config} = action
    return {
      ...state,
      ...config,
      ready: true,
    }
  }

  // all other actions requires the state to be ready
  if (! state.ready)
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
    try {
      const expedId = expedNameToId( action.body.api_quest_name )
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

      return _.flow(_.compact(modifiers))(state)
    } catch (e) {
      debug.error(`failed to record a successful exped ${e}`)
      return state
    }
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
