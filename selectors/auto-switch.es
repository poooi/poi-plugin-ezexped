import { createSelector } from 'reselect'
import {
  isMainFleetFuncSelector,
} from './common'
import {
  allFleetIdsSelector,
  indexedFleetsInfoSelector,
} from './fleet-info'

// return next available fleet id for expeditions,
// null if we cannot find such a fleet
const nextAvailableFleetIdSelector = createSelector(
  allFleetIdsSelector,
  indexedFleetsInfoSelector,
  isMainFleetFuncSelector,
  (allFleetIds, indexedFleetsInfo, isMainFleetFunc) => {
    const fleetIds =
      allFleetIds.filter(fleetId =>
        ! isMainFleetFunc(fleetId) &&
        indexedFleetsInfo[fleetId] &&
        indexedFleetsInfo[fleetId].available)
    return fleetIds.length > 0 ? fleetIds[0] : null
  })

export {
  nextAvailableFleetIdSelector,
}
