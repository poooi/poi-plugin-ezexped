import { connect } from 'react-redux'
import {
  createStructuredSelector,
} from 'reselect'

import {
  fleetAutoSwitchSelector,
  selectedExpedsSelector,
  gsFlagsSelector,
  hideMainFleetSelector,
  sparkledCountSelector,
  hideSatReqsSelector,
  isFleetCombinedSelector,
  visibleFleetsInfoSelector,
  fleetIdSelector,
} from './selectors'

import { reducer, mapDispatchToProps } from './store'
import { Settings as settingsClass } from './ui/settings'
import { EZExpedMain } from './ui'

/*

   TODO

   - reduxify states and move some logic part into selectors
   - redo requirement implementation, allow alternative fleet compo
   - fleet tooltip redo, might include morale & related equips (DLC & drum)
   - exped table: fleet tag on buttons for showing which fleet is currently running that exped

 */

const mainUISelector = createStructuredSelector({
  fleets: visibleFleetsInfoSelector,
  isFleetCombined: isFleetCombinedSelector,
  fleetId: fleetIdSelector,
  fleetAutoSwitch: fleetAutoSwitchSelector,
  selectedExpeds: selectedExpedsSelector,
  gsFlags: gsFlagsSelector,
  hideMainFleet: hideMainFleetSelector,
  sparkledCount: sparkledCountSelector,
  hideSatReqs: hideSatReqsSelector,
})

const reactClass = connect(
  mainUISelector,
  mapDispatchToProps)(EZExpedMain)

const switchPluginPath = [
  {
    path: '/kcsapi/api_get_member/mission',
    valid: () => true,
  },
  {
    path: '/kcsapi/api_req_mission/result',
    valid: () => true,
  },
]

export {
  reactClass,
  reducer,
  settingsClass,
  switchPluginPath,
}
