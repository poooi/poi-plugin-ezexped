import _ from 'lodash'
import { observer } from 'redux-observers'
import { createStructuredSelector } from 'reselect'
import {
  fleetAutoSwitchSelector,
  expedFleetsAvailabilitySelector,
} from '../selectors'
import {
  asyncBoundActionCreators,
} from '../store'

/*
   observes expedition fleet availability changes
   and send a "switch to next fleet" request

   see ../docs/auto-switch.md for details

*/
const expedFleetsAvailabilityObserver = observer(
  createStructuredSelector({
    avails: expedFleetsAvailabilitySelector,
    fleetAutoSwitch: fleetAutoSwitchSelector,
  }),
  (dispatch, current, previous) => {
    if (current.fleetAutoSwitch) {
      // check shape difference
      if (
        /*
           if shape check fails:

           - could be that user is openning a new fleet
           - or a combined fleet is formed / cancelled

           the observer is interested in none of these changes.
         */
        _.isEqual(
          current.avails.map(x => x.fleetId),
          previous.avails.map(x => x.fleetId))
      ) {
        // find difference
        const ava = current.avails.find((cur,ind) =>
          previous.avails[ind].available === true &&
          cur.available === false)

        if (ava)
          asyncBoundActionCreators(
            ({autoSwitchToNextAvailable}) => autoSwitchToNextAvailable(
              `observer: detected that we are sending fleet ${ava.fleetId} out`
            ),
            dispatch
          )
      } // if same shape
    } // if fleetAutoSwitch
  }
)

export {
  expedFleetsAvailabilityObserver,
}
