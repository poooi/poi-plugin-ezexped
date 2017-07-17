import { createSelector } from 'reselect'
import { _ } from 'lodash'
import {
  extSelector,
  isFleetCombinedSelector,
  fleetIdSelector,
  hideMainFleetSelector,
  sparkledCountSelector,
} from './common'
import {
  mkFleetInfoSelector,
  allFleetsInfoSelector,
} from './fleet-info'

import {} from './exped-reqs'

const visibleFleetsInfoSelector = createSelector(
  allFleetsInfoSelector,
  hideMainFleetSelector,
  isFleetCombinedSelector,
  (allFleetsInfo,hideMainFleet, isFleetCombined) => {
    const minId = hideMainFleet ?
      /*
         is hiding main fleet.

         - for combined fleets, we need to hide
           both first (id=1) fleet and second (id=2) one
         - otherwise just first (id=1) fleet

       */
      (isFleetCombined ? 3 : 2) :
      1

    return allFleetsInfo.filter(fleetInfo =>
      fleetInfo && fleetInfo.id >= minId)
  })

export {
  extSelector,
  isFleetCombinedSelector,
  fleetIdSelector,
  hideMainFleetSelector,
  sparkledCountSelector,

  mkFleetInfoSelector,
  visibleFleetsInfoSelector,
}
