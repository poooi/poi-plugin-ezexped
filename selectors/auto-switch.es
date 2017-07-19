import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  isMainFleetFuncSelector,
} from './common'
import {
  allFleetIdsSelector,
  indexedFleetsInfoSelector,
} from './fleet-info'

/*
   selects the Array of expedition fleets.
   (an expedition fleet is a openned non-main fleet)
 */
const expedFleetIdsSelector = createSelector(
  allFleetIdsSelector,
  isMainFleetFuncSelector,
  (allFleetIds, isMainFleetFunc) =>
    allFleetIds.filter(fleetId => !isMainFleetFunc(fleetId)))

const expedFleetsAvailabilitySelector = createSelector(
  expedFleetIdsSelector,
  indexedFleetsInfoSelector,
  (expedFleetIds, indexedFleetsInfo) =>
    expedFleetIds.map(fleetId => ({
      fleetId,
      // guaranteed to return a <bool>
      available:
        _.get(indexedFleetsInfo,[fleetId,'available']) === true,
    })))

// return next available fleet id for expeditions,
// null if we cannot find such a fleet
const nextAvailableFleetIdSelector = createSelector(
  allFleetIdsSelector,
  indexedFleetsInfoSelector,
  isMainFleetFuncSelector,
  (allFleetIds, indexedFleetsInfo, isMainFleetFunc) => {
    const availableFleetIds = allFleetIds.filter(fleetId =>
      ! isMainFleetFunc(fleetId) &&
      indexedFleetsInfo[fleetId] &&
      indexedFleetsInfo[fleetId].available)
    return availableFleetIds.length > 0 ? availableFleetIds[0] : null
  }
)

export {
  expedFleetsAvailabilitySelector,
  nextAvailableFleetIdSelector,
}
