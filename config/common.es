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

   - 1.3.0: added 'dlcFlags' (an Object whose keys are expedition ids
     with bool values default to true)

 */

const expedIds = [...enumFromTo(1,40),100,101,102]

const defaultConfig = {
  fleetAutoSwitch: true,
  hideMainFleet: false,
  hideSatReqs: false,
  sparkledCount: 6,
  syncMainFleetId: false,
  fleetId: 1,

  gsFlags: _.fromPairs(
    expedIds.map(eId => [eId, false])),
  selectedExpeds: _.fromPairs(
    enumFromTo(1,4).map(fleetId => [fleetId, 1])),
  dlcFlags: _.fromPairs(
    expedIds.map(eId => [eId, true])
  ),

  kanceptsExportShipList: true,

  configVer: '1.3.0',
}

const defaultConfigProps = Object.keys(defaultConfig)

export {
  defaultConfig,
  defaultConfigProps,
}
