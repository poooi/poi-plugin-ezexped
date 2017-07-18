/*

   new in-game action-based auto switch mechanism without guesswork

 */
import { store } from 'views/create-store'

import { mapDispatchToProps } from './action-creator'
import {
  nextAvailableFleetSelector,
} from '../selectors/auto-switch'
import {
  hideMainFleetSelector,
} from '../selectors'

// let's coin "subReducer" to mean an almost-reducer,
// which is guaranteed to receive non-undefined state values
// and doesn't require to provide a default one.
const subReducer = (state, action) => {
  if (
    // the user is entering expedition screen
    action.type === '@@Response/kcsapi/api_get_member/mission' ||
    // the user is sending a fleet to expedition
    action.type === '@@Response/kcsapi/api_req_mission/start'
  ) {
    const poiState = store.getState()

    const mayFleetId = nextAvailableFleetSelector(poiState)
    if (typeof mayFleetId === 'number') {
      const fleetId = mayFleetId
      store.dispatch(dispatch => setTimeout(() =>
        mapDispatchToProps(dispatch).changeFleet(
          fleetId,
          'auto switch: at exped screen, next available fleet found')))
    } else {
      const hideMainFleet = hideMainFleetSelector(poiState)
      if (! hideMainFleet) {
        store.dispatch(dispatch => setTimeout(() =>
          mapDispatchToProps(dispatch).changeFleet(
            1,
            'auto switch: at exped screen, no fleet available, switching to main')))
      }
    }
    return state
  }

  return state
}

export {
  subReducer,
}
