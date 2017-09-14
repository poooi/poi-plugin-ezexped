import _ from 'lodash'
import { createSelector } from 'reselect'

import {
  mkFleetInfoSelector,
  isMainFleetFuncSelector,
  expedIdSelectorForFleet,
  gsFlagSelectorForFleet,
  dlcFlagSelectorForFleet,
  mkEReqSatFlagsSelectorForFleet,
  hideMainFleetSelector,
} from '../../selectors'

import { FleetState } from './fleet-state'

const mk = FleetState.make

const fleetStateSelector = _.memoize(
  fleetId => createSelector(
    mkFleetInfoSelector(fleetId),
    isMainFleetFuncSelector,
    expedIdSelectorForFleet(fleetId),
    gsFlagSelectorForFleet(fleetId),
    dlcFlagSelectorForFleet(fleetId),
    mkEReqSatFlagsSelectorForFleet(fleetId),
    hideMainFleetSelector,
    (
      fleet, isMainFleetFunc,
      configExpedId, needGreatSuccess, fillDlc, flags,
      hideMainFleet
    ) => {
      if (isMainFleetFunc(fleetId)) {
        return mk.Main(hideMainFleet)
      }

      if (fleet === null) {
        return mk.NotAvail()
      }

      if (!fleet.available) {
        // perhaps on expedition
        return fleet.duringExpedId ? mk.OnExped(fleet.duringExpedId)
          : mk.NotAvail()
      }

      /*
         otherwise we are looking at an available fleet,
         should use data from config
       */
      const expedId = configExpedId
      const {normFlag, gsFlag, resupplyFlag, dlcFlag} = flags
      const effectiveDlcFlag = !fillDlc || (fillDlc && dlcFlag)
      const effectiveNormFlag = normFlag && effectiveDlcFlag
      const effectiveGsFlag = !needGreatSuccess || gsFlag

      // if every requirements are met (without considering resupplyFlag)
      if (effectiveNormFlag && effectiveGsFlag) {
        // now consider resupply flag in this block
        return resupplyFlag ? mk.Ready(expedId) : mk.NeedResupply(expedId)
      }

      return mk.Unmet(expedId)
    }
  )
)

export {
  fleetStateSelector,
}
