import { createSelector } from 'reselect'
import { isFleetCombinedSelector } from './common'
import {
  allFleetIdsSelector,
  indexedFleetsInfoSelector,
} from './fleet-info'

// TODO: name fleet => fleetId

// return next available fleet id for expeditions,
// null if we cannot find such a fleet
const nextAvailableFleetIdSelector = createSelector(
  allFleetIdsSelector,
  indexedFleetsInfoSelector,
  isFleetCombinedSelector,
  (allFleetIds, indexedFleetsInfo, isFleetCombined) => {
    const minFleetId = isFleetCombined ? 3 : 2
    const fleetIds =
      allFleetIds.filter(fleetId =>
        fleetId >= minFleetId &&
        indexedFleetsInfo[fleetId] &&
        indexedFleetsInfo[fleetId].available)
    return fleetIds.length > 0 ? fleetIds[0] : null
  })

export {
  nextAvailableFleetIdSelector,
}
