import { expedNameToId } from './exped-info'
import { modifyObject } from './utils'

import { defaultConfig } from './config'

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
    return {
      ...state,
      fleetId: action.fleetId,
    }
  }

  // only record successful expeditions
  if (action.type === '@@Response/kcsapi/api_req_mission/result') {
    const expedId = expedNameToId( action.body.api_quest_name )
    const fleetId = parseInt(action.postBody.api_deck_id, 10)
    let currentState = state

    if (action.body.api_clear_result !== 0) {
      currentState = modifyObject(
        'selectedExpeds',
        modifyObject(
          fleetId, () => expedId))(currentState)
    }

    // switch to the corresponding fleet on expedition result screen
    // if "fleetAutoSwitch" is on
    if (state.fleetAutoSwitch) {
      return {
        ...currentState,
        fleetId,
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
  changeFleet: (fleetId,reason=null) =>
    dispatch({
      type: '@poi-plugin-ezexped@ChangeFleet',
      fleetId,
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
