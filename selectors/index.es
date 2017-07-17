import { createSelector } from 'reselect'
import _ from 'lodash'
import {
  hideMainFleetSelector,
  isFleetCombinedSelector,
  selectedExpedsSelector,
  gsFlagsSelector,
  fleetIdSelector,
} from './common'
import {
  allFleetIdsSelector,
  indexedFleetsInfoSelector,
} from './fleet-info'

import {} from './exped-reqs'

const visibleFleetIdsSelector = createSelector(
  allFleetIdsSelector,
  hideMainFleetSelector,
  isFleetCombinedSelector,
  (allFleetIds, hideMainFleet, isFleetCombined) =>
    allFleetIds.filter(fleetId => {
      if (!hideMainFleet)
        return true

      const isMainFleet = isFleetCombined ?
        (
          /*
             for a combined fleet, both the first and the second fleets
             should be considered main fleet
           */
          fleetId <= 2
        ) :
        (
          // otherwise we just need to hide the first fleet
          fleetId === 1
        )
      return !isMainFleet
    }))

const visibleFleetsInfoSelector = createSelector(
  indexedFleetsInfoSelector,
  visibleFleetIdsSelector,
  (indexedFleetsInfo,visibleFleetIds) =>
    visibleFleetIds.map(fleetId =>
      indexedFleetsInfo[fleetId]))

// TODO: cases where fleet is not available.

// the expedition selected for current focusing fleet
const expedIdSelector = createSelector(
  selectedExpedsSelector,
  fleetIdSelector,
  (selectedExpeds,fleetId) => selectedExpeds[fleetId])

const gsFlagSelector = createSelector(
  gsFlagsSelector,
  expedIdSelector,
  (gsFlags,expedId) => gsFlags[expedId])

const fleetInfoSelector = createSelector(
  indexedFleetsInfoSelector,
  fleetIdSelector,
  (indexedFleetsInfo,fleetId) => indexedFleetsInfo[fleetId])

export * from './common'
export * from './fleet-info'

export {
  visibleFleetsInfoSelector,
  expedIdSelector,
  gsFlagSelector,
  fleetInfoSelector,
}
