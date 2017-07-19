import _ from 'lodash'
import { observer } from 'redux-observers'
import { createStructuredSelector } from 'reselect'
import {
  availableFleetIdsSelector,
  hideMainFleetSelector,
  fleetAutoSwitchSelector,
} from '../selectors'
import { mapDispatchToProps } from '../store'

/*
   observe next fleet available for expedition
   and switching to that fleet if fleet auto switch is on

   see also: ../store/auto-switch.es

   note that we should observe the change of array of available fleets
   (main fleets are excluded because they cannot be sent to expeditions)
   rather than just observing 'nextAvailableFleetId'.
   otherwise we cannot handle the following scenario correctly

   - if available fleets are 2,4
   - on expedition screen, user sends fleet 4 first
   - because 'nextAvailableFleetId' does not change, observer will do nothing

   TODO: should handle sending / returning separately:

   - when sending a fleet out, we detect true => false changes on availability,
     and switch to next fleet
   - when a fleet is returning, we detect false => true changes, and switch to that fleet
     (note that first available fleet is not always the returning fleet!)

*/
const availableFleetIdsObserver = observer(
  createStructuredSelector({
    availableFleetIds: availableFleetIdsSelector,
    fleetAutoSwitch: fleetAutoSwitchSelector,
    hideMainFleet: hideMainFleetSelector,
  }),
  (dispatch, current, previous) => {
    if (current.fleetAutoSwitch !== true)
      return

    if (! _.isEqual(current.availableFleetIds, previous.availableFleetIds)) {
      const {availableFleetIds, hideMainFleet} = current
      const nextAvailableFleetId =
        availableFleetIds.length > 0 ? availableFleetIds[0] : null
      if (nextAvailableFleetId !== null) {
        mapDispatchToProps(dispatch)
          .changeFleet(
            nextAvailableFleetId,
            'change detected by observer')
      } else {
        if (!hideMainFleet)
          mapDispatchToProps(dispatch)
            .changeFleet(
              1,
              'switching to main by observer')
      }
    }
  })

export { availableFleetIdsObserver }
