import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  extensionSelectorFactory,
  sortieSelector,
} from 'views/utils/selectors'

import { initState } from '../store'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-ezexped'),
  ext => _.isEmpty(ext) ? initState : ext)

const isFleetCombinedSelector =
  createSelector(
    sortieSelector,
    sortie => sortie.combinedFlag !== 0)

const fleetIdSelector = createSelector(
  extSelector,
  ext => ext.fleetId)

const hideMainFleetSelector = createSelector(
  extSelector,
  ext => ext.hideMainFleetSelector)

const sparkledCountSelector = createSelector(
  extSelector,
  ext => ext.sparkledCount)

export {
  extSelector,
  isFleetCombinedSelector,
  fleetIdSelector,
  hideMainFleetSelector,
  sparkledCountSelector,
}
