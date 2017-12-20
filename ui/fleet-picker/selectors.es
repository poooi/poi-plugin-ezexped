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
  getExpedInfoFuncSelector,
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
    getExpedInfoFuncSelector,
    (
      fleet, isMainFleetFunc,
      psExpedId, needGreatSuccess, fillDlc, flags,
      hideMainFleet, getExpedInfo
    ) => {
      const displayNumOf = eId => {
        const info = getExpedInfo(eId)
        return info ? info.displayNum : eId
      }

      if (isMainFleetFunc(fleetId)) {
        return mk.Main(hideMainFleet)
      }

      if (fleet === null) {
        return mk.NotAvail()
      }

      if (!fleet.available) {
        // perhaps on expedition
        return fleet.duringExpedId ? mk.OnExped(displayNumOf(fleet.duringExpedId))
          : mk.NotAvail()
      }

      /*
         otherwise we are looking at an available fleet,
         should use data from p-state
       */
      const expedId = psExpedId
      const displayNum = displayNumOf(expedId)
      const {normFlag, gsFlag, resupplyFlag, dlcFlag} = flags
      const effectiveDlcFlag = !fillDlc || (fillDlc && dlcFlag)
      const effectiveNormFlag = normFlag && effectiveDlcFlag
      const effectiveGsFlag = !needGreatSuccess || gsFlag

      // if every requirements are met (without considering resupplyFlag)
      if (effectiveNormFlag && effectiveGsFlag) {
        // now consider resupply flag in this block
        return resupplyFlag ? mk.Ready(displayNum) : mk.NeedResupply(displayNum)
      }

      return mk.Unmet(displayNum)
    }
  )
)

export {
  fleetStateSelector,
}
