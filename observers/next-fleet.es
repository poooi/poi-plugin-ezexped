import { observer } from 'redux-observers'
import { createStructuredSelector } from 'reselect'
import {
  nextAvailableFleetSelector,
  hideMainFleetSelector,
  fleetAutoSwitchSelector,
} from '../selectors'
import { mapDispatchToProps } from '../store'

/*
   observe next fleet available for expedition
   and switching to that fleet if fleet auto switch is on

   see also: ../store/auto-switch.es
 */
const nextAvailableFleetObserver = observer(
  createStructuredSelector({
    nextAvailableFleet: nextAvailableFleetSelector,
    fleetAutoSwitch: fleetAutoSwitchSelector,
    hideMainFleet: hideMainFleetSelector,
  }),
  (dispatch, current, previous) => {
    if (current.fleetAutoSwitch !== true)
      return

    if (current.nextAvailableFleet !== previous.nextAvailableFleet) {
      const {nextAvailableFleet, hideMainFleet} = current
      if (nextAvailableFleet !== null) {
        mapDispatchToProps(dispatch)
          .changeFleet(
            nextAvailableFleet,
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

export { nextAvailableFleetObserver }
