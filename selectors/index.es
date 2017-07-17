import { createSelector } from 'reselect'
import { _ } from 'lodash'

import {
  sortieSelector,
} from 'views/utils/selectors'

import { extSelector, extConfigSelector } from './common'
import {
  mkFleetInfoSelector,
  allFleetsInfoSelector,
} from './fleet-info'

import {} from './exped-reqs'

const isFleetCombinedSelector =
  createSelector(
    sortieSelector,
    sortie => sortie.combinedFlag !== 0)

const fleetIdSelector = createSelector(
  extSelector,
  ext => ext.fleetId)

const visibleFleetsInfoSelector = createSelector(
  allFleetsInfoSelector,
  extConfigSelector,
  isFleetCombinedSelector,
  (allFleetsInfo, {config}, isFleetCombined) => {
    const { hideMainFleet } = config
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
  mkFleetInfoSelector,
  isFleetCombinedSelector,
  fleetIdSelector,
  visibleFleetsInfoSelector,

  extSelector,
  extConfigSelector,
}
