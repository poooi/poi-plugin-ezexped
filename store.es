import { expedNameToId } from './exped-info'
import { modifyObject } from './utils'

import { defaultConfig } from './config'

const initState = {
  ...defaultConfig,
  ready: false,
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-ezexped@ConfigReady') {
    const {config} = action
    return {
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

  if (action.type === "@poi-plugin-ezexped@ChangeFleet") {
    return {
      ...state,
      fleetInd: action.fleetInd,
    }
  }

  // only record successful expeditions
  if (action.type === "@@Response/kcsapi/api_req_mission/result") {
    const expedId = expedNameToId( action.body.api_quest_name )
    const fleetInd = parseInt(action.postBody.api_deck_id, 10)-1
    let currentState = state

    if (action.body.api_clear_result !== 0) {
      currentState = modifyObject(
        'selectedExpeds',
        modifyObject(
          fleetInd, () => expedId))(currentState)
    }

    // switch to the corresponding fleet on expedition result screen
    // if "fleetAutoSwitch" is on
    if (state.fleetAutoSwitch) {
      return {
        ...currentState,
        fleetInd,
      }
    }

    return state
  }
  return state
}

const mapDispatchToProps = dispatch => ({
  configReady: config =>
    dispatch({
      type: '@poi-plugin-ezexped@ConfigReady',
      config,
    }),
  changeFleet: (fleetInd,reason=null) =>
    dispatch({
      type: "@poi-plugin-ezexped@ChangeFleet",
      fleetInd,
      reason,
    }),
  modifyState: modifier =>
    dispatch({
      type: '@poi-plugin-ezexped@ModifyState',
      modifier,
    }),
})

export {
  initState,
  reducer,
  mapDispatchToProps,
}
