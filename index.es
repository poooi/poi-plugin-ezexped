import { connect } from 'react-redux'

import {
  isFleetCombinedSelector,
  visibleFleetsInfoSelector,
  fleetIndSelector,
  extConfigSelector,
} from './selectors'

import { reducer, mapDispatchToProps } from './store'

import {
  Settings,
} from './ui/settings'

import { EZExpedMain } from './ui'

const settingsClass = Settings


/*

   - reduxify states and move some logic part into selectors
   - redo requirement implementation, allow alternative fleet compo
   - fleet tooltip redo, might include morale & related equips (DLC & drum)

 */

const reactClass = connect(
  state => {
    const {config} = extConfigSelector(state)
    const isFleetCombined = isFleetCombinedSelector(state)
    const fleets = visibleFleetsInfoSelector(state)
    const fleetInd = fleetIndSelector(state)
    return {
      fleets,
      isFleetCombined,
      fleetInd,
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
