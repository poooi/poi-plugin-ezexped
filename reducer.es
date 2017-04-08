import * as storage from './storage'
import { expedNameToId } from './exped-info'

const loadState = () => ({
  config: storage.load(),
  fleetId: 0,
})

const reducer = (state = loadState(), action) => {
  if (action.type === "@poi-plugin-ezexped@UpdateConfig") {
    return {
      ...state,
      config: storage.modifyStorage(action.modifier),
    }
  }
  if (action.type === "@poi-plugin-ezexped@ChangeFleet") {
    return {
      ...state,
      fleetId: action.fleetId,
    }
  }

  // only record successful expeditions
  if (action.type === "@@Response/kcsapi/api_req_mission/result"
      && action.body.api_clear_result !== 0) {
    const expedId = expedNameToId( action.body.api_quest_name )
    const fleetId = parseInt(action.postBody.api_deck_id, 10)-1
    return {
      ...state,
      config: storage.modifyStorage(config => {
        const newConfig = { ... config }
        newConfig.selectedExpeds = [ ... config.selectedExpeds ]
        newConfig.selectedExpeds[fleetId] = expedId
        return newConfig
      }),
    }
  }

  return state
}

const mapDispatchToProps = dispatch => ({
  onModifyConfig: modifier => dispatch({
    type: "@poi-plugin-ezexped@UpdateConfig",
    modifier,
  }),
  onChangeFleet: (fleetId,reason=null) => dispatch({
    type: "@poi-plugin-ezexped@ChangeFleet",
    fleetId,
    reason,
  }),
})

export { reducer, mapDispatchToProps }
