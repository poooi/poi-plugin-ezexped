import { observer } from 'redux-observers'
import { createStructuredSelector } from 'reselect'
import {
  nextAvailableFleetIdSelector,
  hideMainFleetSelector,
  fleetAutoSwitchSelector,
} from '../selectors'
import { mapDispatchToProps } from '../store'

/*
   observe next fleet available for expedition
   and switching to that fleet if fleet auto switch is on

   see also: ../store/auto-switch.es
 */
const nextAvailableFleetIdObserver = observer(
  createStructuredSelector({
    nextAvailableFleetId: nextAvailableFleetIdSelector,
    fleetAutoSwitch: fleetAutoSwitchSelector,
    hideMainFleet: hideMainFleetSelector,
  }),
  (dispatch, current, previous) => {
    if (current.fleetAutoSwitch !== true)
      return

    if (current.nextAvailableFleetId !== previous.nextAvailableFleetId) {
      const {nextAvailableFleetId, hideMainFleet} = current
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

export { nextAvailableFleetIdObserver }
