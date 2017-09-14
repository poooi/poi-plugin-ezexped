import _ from 'lodash'
import { enumFromTo } from 'subtender'

/*

   config data versioning:

   - starting at '1.0.0', consider it's legacy otherwise
   - keep in sync with the latest package version that
     has made changes to config structure.

   config structure changelog:

   - 1.1.0: added 'syncMainFleetId' (default to false)

   - 1.2.0: added 'kanceptsExportShipList' (default to true)

   - 1.3.0: added 'dlcFlags' (an Object whose keys are
     from "1" to "40" with bool values default to true)

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
  dlcFlags: _.fromPairs(
    enumFromTo(1,40).map(eId => [eId, true])
  ),

  kanceptsExportShipList: true,

  configVer: '1.3.0',
}

const defaultConfigProps = Object.keys(defaultConfig)

export {
  defaultConfig,
  defaultConfigProps,
}
