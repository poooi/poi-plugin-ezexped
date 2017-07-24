import _ from 'lodash'
import { observer } from 'redux-observers'
import {
  createSelector,
  createStructuredSelector,
} from 'reselect'

import { stateSelector as poiStateSelector } from 'views/utils/selectors'

import {
  syncMainFleetIdSelector,
  fleetIdSelector,
  isMainFleetFuncSelector,
  hideMainFleetSelector,
} from '../selectors'
import {
  asyncBoundActionCreator,
} from '../store'

const poiActiveFleetIdSelector = createSelector(
  poiStateSelector,
  state =>
    // poi main program refers "fleetId" as the index into fleets Array
    // while EZ Exped uses "fleetId" to mean the "api_id" property of a fleet.
    // thus the "+ 1".
    _.get(state, 'ui.activeFleetId', 0) + 1)

const syncMainFleetObserver = observer(
  createStructuredSelector({
    shouldSync: syncMainFleetIdSelector,

    fleetId: fleetIdSelector,
    poiFleetId: poiActiveFleetIdSelector,

    isMainFleetFunc: isMainFleetFuncSelector,
    hideMainFleet: hideMainFleetSelector,
  }),
  (dispatch, cur, prev) => {
    if (!cur.shouldSync)
      return

    // already in sync, do nothing
    if (cur.fleetId === cur.poiFleetId)
      return

    const poiFleetIdChanged = prev.poiFleetId !== cur.poiFleetId
    const ezeFleetIdChanged = prev.fleetId !== cur.fleetId

    const {hideMainFleet, isMainFleetFunc} = cur
    const validFleetId = fleetId => [1,2,3,4].includes(fleetId)
    const shouldConsiderFleetId =
      hideMainFleet ? (
        /*
           when main fleet is supposed to be hidden,
           we will not listen to any changes that involves main fleet
         */
        fleetId => ! isMainFleetFunc(fleetId)
      ) : (
        // not hiding main fleet, consider all fleet ids
        () => true
      )

    const {poiFleetId,fleetId} = cur
    // main fleet change first
    if (
      poiFleetIdChanged &&
      validFleetId(poiFleetId) &&
      shouldConsiderFleetId(poiFleetId)
    ) {
      asyncBoundActionCreator(
        ({changeFleet}) =>
          changeFleet(poiFleetId,`sync with main fleet`),
        dispatch)
      return
    }

    // some checks above are not actually necessary
    // due to how UI behaviors on certain settings
    // but the check is cheap and we'd better to be safe.
    if (
      ezeFleetIdChanged &&
      validFleetId(fleetId) &&
      shouldConsiderFleetId(fleetId)
    ) {
      asyncBoundActionCreator(
        ({changeFleetFocusInMainUI}) =>
          changeFleetFocusInMainUI(fleetId,false),
        dispatch)
      return
    }

    // no-useless-return is sometimes useful, not always.
    _.noop()
  }
)

export { syncMainFleetObserver }
