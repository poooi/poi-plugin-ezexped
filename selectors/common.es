import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  extensionSelectorFactory,
  sortieSelector,
  configSelector,
} from 'views/utils/selectors'

import { initState } from '../store'

const isFleetCombinedSelector =
  createSelector(
    sortieSelector,
    sortie => sortie.combinedFlag !== 0)

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-ezexped'),
  ext => _.isEmpty(ext) ? initState : ext)

/*
   if we need to load some parts of the state with dynamic propNames,
   we can use this function so selectors accessing the store with same propNames
   are never re-created
 */
const mkExtPropSelector = _.memoize(propName =>
  createSelector(extSelector, ext => ext[propName]))

const fleetAutoSwitchSelector =
  mkExtPropSelector('fleetAutoSwitch')
const hideMainFleetSelector =
  mkExtPropSelector('hideMainFleet')
const hideSatReqsSelector =
  mkExtPropSelector('hideSatReqs')
const sparkledCountSelector =
  mkExtPropSelector('sparkledCount')
const syncMainFleetIdSelector =
  mkExtPropSelector('syncMainFleetId')
const fleetIdSelector =
  mkExtPropSelector('fleetId')
const gsFlagsSelector =
  mkExtPropSelector('gsFlags')
const selectedExpedsSelector =
  mkExtPropSelector('selectedExpeds')
const expedTableExpandedSelector =
  mkExtPropSelector('expedTableExpanded')
const readySelector =
  mkExtPropSelector('ready')

const themeSelector = createSelector(
  configSelector,
  config => _.get(config,'poi.theme','paperdark'))

const isDarkThemeSelector = createSelector(
  themeSelector,
  theme => /(dark|black|slate|superhero|papercyan)/i.test(theme))

const darkOrLightSelector = createSelector(
  isDarkThemeSelector,
  isDarkTheme => isDarkTheme ? 'dark' : 'light')

const isMainFleetFuncSelector = createSelector(
  isFleetCombinedSelector,
  isFleetCombined =>
    isFleetCombined ?
      (fleetId => fleetId <= 2) :
      (fleetId => fleetId === 1)
)

export {
  mkExtPropSelector,

  isFleetCombinedSelector,
  isDarkThemeSelector,
  darkOrLightSelector,

  extSelector,

  fleetAutoSwitchSelector,
  hideMainFleetSelector,
  hideSatReqsSelector,
  sparkledCountSelector,
  syncMainFleetIdSelector,
  fleetIdSelector,
  gsFlagsSelector,
  selectedExpedsSelector,
  expedTableExpandedSelector,
  readySelector,

  isMainFleetFuncSelector,
}
