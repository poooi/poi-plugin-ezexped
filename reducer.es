import { expedNameToId } from './exped-info'
import { ezconfigs } from './ezconfig'
import { modifyArray, konst } from './utils'

const initState = {
  // value is initialized to "null",
  // but main UI should have enough info to figure this out
  fleetId: null,
}

const reducer = (state = initState, action) => {
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
    ezconfigs.selectedExpeds.modifyValue(
      modifyArray(fleetId,konst(expedId)))
    return state
  }

  return state
}

const mapDispatchToProps = dispatch => ({
  onChangeFleet: (fleetId,reason=null) => {
    if (fleetId === null) {
      // we assume "onChangeFleet" is always called with a valid
      // fleet index
      console.error("fleetId should not be null")
      return
    }
    dispatch({
      type: "@poi-plugin-ezexped@ChangeFleet",
      fleetId,
      reason,
    })
  },
})

export { reducer, mapDispatchToProps }
