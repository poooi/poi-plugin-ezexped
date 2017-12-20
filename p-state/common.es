import _ from 'lodash'
import { enumFromTo } from 'subtender'
import { ensureDirSync } from 'fs-extra'
import { join } from 'path-extra'

/*

   p-state data versioning:

   - starting at '1.0.0', consider it's legacy otherwise
   - keep in sync with the latest package version that
     has made changes to config structure.

   p-state structure changelog:

   - 1.1.0: added 'syncMainFleetId' (default to false)

   - 1.2.0: added 'kanceptsExportShipList' (default to true)

   - 1.3.0: added 'dlcFlags' (an Object whose keys are expedition ids
     with bool values default to true)

   - 1.4.0: new expedition ids: 100,101,102,
     'dlcFlags' and 'fsFlags' get updated with default values for these keys

   - 1.5.0:

       - gsFlags & dlcFlags no longer expand to new expeditions,
         instead, default values should be used.
       - 'expedTableExpanded' is now included in p-state, the default value is false
       - 'configVer' is removed, instead, '$dataVersion' is now in use

 */

const extStateToPState = extState => {
  const {ready: _ignored, ...ps} = extState
  return ps
}

const getPStateFilePath = () => {
  const { APPDATA_PATH } = window
  const configPath = join(APPDATA_PATH,'ezexped')
  ensureDirSync(configPath)
  return join(configPath,'p-state.json')
}

const latestVersion = '1.5.0'

export {
  extStateToPState,
  getPStateFilePath,
  latestVersion,
}
