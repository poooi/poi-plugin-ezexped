import { connect } from 'react-redux'

import {
  isFleetCombinedSelector,
  visibleFleetsInfoSelector,
  fleetIdSelector,
  extConfigSelector,
} from './selectors'

import { reducer, mapDispatchToProps } from './store'

import {
  Settings,
} from './ui/settings'

import { EZExpedMain } from './ui'

const settingsClass = Settings


/*

   TODO

   - reduxify states and move some logic part into selectors
   - redo requirement implementation, allow alternative fleet compo
   - fleet tooltip redo, might include morale & related equips (DLC & drum)
   - should really be using fleetId (1/2/3/4), because indices are unstable.

 */

const reactClass = connect(
  state => {
    const {config} = extConfigSelector(state)
    const isFleetCombined = isFleetCombinedSelector(state)
    const fleets = visibleFleetsInfoSelector(state)
    const fleetId = fleetIdSelector(state)
    return {
      fleets,
      isFleetCombined,
      fleetId,
      ...config,
    }
  },
  mapDispatchToProps)(EZExpedMain)

const switchPluginPath = [
  {
    path: "/kcsapi/api_get_member/mission",
    valid: () => true,
  },
  {
    path: "/kcsapi/api_req_mission/result",
    valid: () => true,
  },
]

export {
  reactClass,
  reducer,
  settingsClass,
  switchPluginPath,
}
