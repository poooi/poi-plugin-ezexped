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

import { konst } from './utils'

const reactClass = connect(
  state => {
    const config = ezconfigSelector(state)
    const { hideMainFleet } = config
    const isFleetCombined = isFleetCombinedSelector(state)
    const fleets = []

    const beginInd = hideMainFleet
      ? (!isFleetCombined ? 1 : 2)
      : 0

    for (let fleetId=beginInd; fleetId<4; ++fleetId) {
      const fleetRep = mkFleetInfoSelector(fleetId)(state)
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
    valid: konst(true),
  },
  {
    path: "/kcsapi/api_req_mission/result",
    valid: konst(true),
  },
]

export {
  reactClass,
  reducer,
  settingsClass,
  switchPluginPath,
}
