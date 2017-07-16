import { expedNameToId } from './exped-info'
import { ezconfigs } from './ezconfig'
import { modifyArray } from './utils'

const initState = {
  // value is initialized to "null",
  // but main UI should have enough info to figure this out
  fleetInd: null,
}

const reducer = (state = initState, action) => {
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

    if (action.body.api_clear_result !== 0) {
      ezconfigs.selectedExpeds.modifyValue(
        modifyArray(fleetInd,() => expedId))
    }

    // switch to the corresponding fleet on expedition result screen
    // if "fleetAutoSwitch" is on
    if (ezconfigs.fleetAutoSwitch.getValue()) {
      return {
        ...state,
        fleetInd,
      }
    }

    return state
  }
  return state
}

const mapDispatchToProps = dispatch => ({
  onChangeFleet: (fleetInd,reason=null) => {
    if (fleetInd === null) {
      // we assume "onChangeFleet" is always called with a valid
      // fleet index
      console.error("fleetInd should not be null")
      return
    }
    dispatch({
      type: "@poi-plugin-ezexped@ChangeFleet",
      fleetInd,
      reason,
    })
  },
})

export { reducer, mapDispatchToProps }
