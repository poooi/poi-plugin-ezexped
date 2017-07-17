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

const isFleetCombinedSelector =
  createSelector(
    sortieSelector,
    sortie => sortie.combinedFlag !== 0)

const fleetIndSelector = createSelector(
  extSelector,
  ext => ext.fleetInd)

const visibleFleetsInfoSelector = createSelector(
  allFleetsInfoSelector,
  extConfigSelector,
  isFleetCombinedSelector,
  (allFleetsInfo, {config}, isFleetCombined) => {
    const { hideMainFleet } = config
    const fleets = []
    const beginInd = hideMainFleet
      ? (!isFleetCombined ? 1 : 2)
      : 0

    for (let fleetInd=beginInd; fleetInd<4; ++fleetInd) {
      const fleetRep = allFleetsInfo[fleetInd]
      if (fleetRep !== null)
        fleets.push( fleetRep )
    }
    return fleets
  })

export {
  mkFleetInfoSelector,
  isFleetCombinedSelector,
  fleetIndSelector,
  visibleFleetsInfoSelector,

  extSelector,
  extConfigSelector,
}
