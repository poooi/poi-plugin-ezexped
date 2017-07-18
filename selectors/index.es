import { createSelector } from 'reselect'
import _ from 'lodash'
import {
  selectedExpedsSelector,
  gsFlagsSelector,
  fleetIdSelector,
} from './common'
import {
  indexedFleetsInfoSelector,
} from './fleet-info'

import {} from './exped-reqs'

const expedIdSelectorForFleet = _.memoize(fleetId =>
  createSelector(
    selectedExpedsSelector,
    selectedExpeds => selectedExpeds[fleetId]))

const gsFlagSelectorForFleet = _.memoize(fleetId =>
  createSelector(
    gsFlagsSelector,
    expedIdSelectorForFleet(fleetId),
    (gsFlags,expedId) => gsFlags[expedId]))

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
export * from './auto-switch'

export {
  expedIdSelector,
  gsFlagSelector,
  fleetInfoSelector,

  expedIdSelectorForFleet,
  gsFlagSelectorForFleet,
}
