import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  mkFleetInfoSelector,
  isMainFleetFuncSelector,
  gsFlagSelectorForFleet,
  mkEReqSatFlagsSelectorForFleet,
} from '../../selectors'

const mkBsStyleForFleetButtonSelector = _.memoize(
  fleetId => createSelector(
    mkFleetInfoSelector(fleetId),
    isMainFleetFuncSelector,
    gsFlagSelectorForFleet(fleetId),
    mkEReqSatFlagsSelectorForFleet(fleetId),
    (fleet, isMainFleetFunc, needGreatSuccess, flags) => {
      // main fleets are always green
      if (isMainFleetFunc(fleetId)) {
        return 'success'
      }

      const available = fleet === null ? false : fleet.available

      // non-available fleets are always blue
      // (perhaps in the middle of an expedition
      if (!available) {
        return 'primary'
      }

      const {normFlag, gsFlag, resupplyFlag} = flags
      const effectiveGsFlag = !needGreatSuccess || gsFlag

      // if every requirements are met (without considering resupplyFlag)
      if (normFlag && effectiveGsFlag) {
        // now consider resupply flag in this block
        return resupplyFlag ? 'success' : 'warning'
      }

      return 'danger'
    }
  )
)

export {
  mkBsStyleForFleetButtonSelector,
}
