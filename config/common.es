import _ from 'lodash'
import { enumFromTo } from '../utils'

/*

   config data versioning:

   - starting at '1.0.0', consider it's legacy otherwise
   - keep in sync with the latest package version that
     has made changes to config structure.

   config structure changelog:

   - 1.1.0: added 'syncMainFleetId' (default to false)

 */

const defaultConfig = {
  fleetAutoSwitch: true,
  hideMainFleet: false,
  hideSatReqs: false,
  sparkledCount: 6,
  syncMainFleetId: false,
  fleetId: 1,

  gsFlags: _.fromPairs(
    enumFromTo(1,40).map(eId => [eId, false])),
  selectedExpeds: _.fromPairs(
    enumFromTo(1,4).map(fleetId => [fleetId, 1])),

  configVer: '1.1.0',
}

const defaultConfigProps = Object.keys(defaultConfig)

export {
  defaultConfig,
  defaultConfigProps,
}
