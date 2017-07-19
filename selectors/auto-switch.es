import { createSelector } from 'reselect'
import {
  isMainFleetFuncSelector,
} from './common'
import {
  allFleetIdsSelector,
  indexedFleetsInfoSelector,
} from './fleet-info'

const availableFleetIdsSelector = createSelector(
  allFleetIdsSelector,
  indexedFleetsInfoSelector,
  isMainFleetFuncSelector,
  (allFleetIds, indexedFleetsInfo, isMainFleetFunc) =>
    allFleetIds.filter(fleetId =>
      ! isMainFleetFunc(fleetId) &&
      indexedFleetsInfo[fleetId] &&
      indexedFleetsInfo[fleetId].available))

// return next available fleet id for expeditions,
// null if we cannot find such a fleet
const nextAvailableFleetIdSelector = createSelector(
  availableFleetIdsSelector,
  availableFleetIds =>
    availableFleetIds.length > 0 ? availableFleetIds[0] : null)

export {
  availableFleetIdsSelector,
  nextAvailableFleetIdSelector,
}
