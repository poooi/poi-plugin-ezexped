import { connect } from 'react-redux'

import {
  mkFleetInfoSelector,
  isFleetCombinedSelector,
  reduxSelector,
  ezconfigSelector,
} from './selectors'

import { reducer, mapDispatchToProps } from './reducer'
import {
  settingsClass,
} from './settings'

import { EZExpedMain } from './ui'

/*

   - reduxify states and move some logic part into selectors
   - redo requirement implementation, allow alternative fleet compo
   - fleet tooltip redo, might include morale & related equips (DLC & drum)

 */

const reactClass = connect(
  state => {
    const config = ezconfigSelector(state)
    const { hideMainFleet } = config
    const isFleetCombined = isFleetCombinedSelector(state)
    const fleets = []

    const beginInd = hideMainFleet
      ? (!isFleetCombined ? 1 : 2)
      : 0

    for (let fleetInd=beginInd; fleetInd<4; ++fleetInd) {
      const fleetRep = mkFleetInfoSelector(fleetInd)(state)
      if (fleetRep !== null)
        fleets.push( fleetRep )
    }

    const redux = reduxSelector(state)
    return {
      fleets,
      isFleetCombined,
      redux,
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
