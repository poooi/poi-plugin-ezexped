import _ from 'lodash'
import { enumFromTo } from '../utils'

const defaultConfig = {
  fleetAutoSwitch: true,
  hideMainFleet: false,
  hideSatReqs: false,
  sparkledCount: 6,
  fleetInd: 0,

  gsFlags: _.fromPairs(
    enumFromTo(1,40).map(eId => [eId, false])),
  selectedExpeds: _.fromPairs(
    enumFromTo(0,3).map(fleetInd => [fleetInd, 1])),

  configVer: '1.0.0',
}

export { defaultConfig }
