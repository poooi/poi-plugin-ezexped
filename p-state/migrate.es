/*
   this module contains migration logic
   to deal with p-state version prior to 1.5.0
 */
import _ from 'lodash'
import { readJsonSync } from 'fs-extra'
import { enumFromTo } from 'subtender'

import { getPStateFilePath } from './common'
import { savePState } from './save'

const {config} = window

const maxOldVersion = '1.4.0'

const mkOldDefaultPState = () => ({
  fleetAutoSwitch: true,
  hideMainFleet: false,
  hideSatReqs: false,
  gsRateCustom: 100,
  syncMainFleetId: false,
  fleetId: 1,
  gsFlags: {},
  selectedExpeds: _.fromPairs(
    enumFromTo(1,4).map(fleetId => [fleetId, 1])),
  dlcFlags: {},
  kanceptsExportShipList: true,
  configVer: maxOldVersion,
})

/*
   prior to ezexped 1.5.0, p-state are stored in poi config,
   this part attempts to get p-state from poi-config and update p-state
   all the way up to 1.4.0 and perform necessary operations.

   when this function returns, it's guaranteed that:

   - returns null if default p-state should be used or an error occurred
   - it returns either null or p-state updated to version 1.4.0
   - if the return value is non-null, "config.plugin.poi-plugin-ezexped.data"
     should contain the p-state updated to version 1.4.0 as well
   - "config.plugin.poi-plugin-ezexped" should be an Object that
     has property "enable" and optionally "data", but nothing else.

*/
const loadAndUpdateOldPStateFromConfig = () => {
  // postfixing 'W' means the actual data is wrapped in 'data' property.
  const oldPStateW = config.get('plugin.poi-plugin-ezexped')

  /*
     NOTE: "p-state" was previously called "config", therefore you might see things
     like "configVer" in updating logic
   */

  /*
     when the data is invalid - this usually won't happen, as
     poi will use "enable" property of it.
     but in case something goes very wrong, we'll reset this part
     and but keep ezexped disabled.
   */
  if (_.isEmpty(oldPStateW) || typeof oldPStateW !== 'object') {
    config.set('plugin.poi-plugin-ezexped',{enable: false})
    return null
    // no saving on purpose, so if user doesn't change anything
    // it'll always use default of the latest version.
  }

  // INVARIANT: typeof oldPStateW === 'object'

  // nothing to update if p-state version matches
  if (_.get(oldPStateW,'data.configVer') === maxOldVersion) {
    return oldPStateW.data
  }

  // recognize & update from legacy p-state to 1.1.0
  if (!_.get(oldPStateW,'data.configVer')) {
    // copy p-state template
    const currentPState = mkOldDefaultPState();

    // direct field copies
    [
      // 'gsFlags', 'selectedExpeds',
      'fleetAutoSwitch', 'hideMainFleet', 'hideSatReqs',
    ].map(propName => {
      const val = _.get(oldPStateW,propName)
      if (typeof val !== 'undefined')
        currentPState[propName] = val
    })

    // field name changed:
    // recommendGSRateCustom => gsRateCustom
    {
      const val = _.get(oldPStateW,'recommendGSRateCustom')
      if (typeof val !== 'undefined')
        currentPState.gsRateCustom = val
    }

    // structural changes
    {
      const val = _.get(oldPStateW,'gsFlags')
      if (typeof val !== 'undefined') {
        enumFromTo(1,40).map(eId => {
          currentPState.gsFlags[eId] = val[eId]
        })
      }
    }
    {
      const val = _.get(oldPStateW,'selectedExpeds')
      if (typeof val !== 'undefined') {
        // the old version is actually using fleetInd
        enumFromTo(0,3).map(fleetInd => {
          const fleetId = fleetInd+1
          currentPState.selectedExpeds[fleetId] = val[fleetInd]
        })
      }
    }

    oldPStateW.data = currentPState
    // update poi config storage by wiping old data
    // new one will be ready when all updates are done.
    const enable = Boolean(_.get(oldPStateW,'enable'))
    // clear data
    config.set('plugin.poi-plugin-ezexped',{enable})
  }

  if (_.get(oldPStateW,'data.configVer') === '1.0.0') {
    // update from 1.0.0 to 1.1.0
    const updatedPState = {
      ...oldPStateW.data,
      syncMainFleetId: false,
      configVer: '1.1.0',
    }

    oldPStateW.data = updatedPState
  }

  if (_.get(oldPStateW,'data.configVer') === '1.1.0') {
    // update from 1.1.0 to 1.2.0
    const updatedPState = {
      ...oldPStateW.data,
      kanceptsExportShipList: true,
      configVer: '1.2.0',
    }

    oldPStateW.data = updatedPState
  }

  if (_.get(oldPStateW,'data.configVer') === '1.2.0') {
    // update from 1.2.0 to 1.3.0
    const dlcFlags = _.fromPairs(enumFromTo(1,40).map(eId => [eId, true]))
    const updatedPState = {
      ...oldPStateW.data,
      dlcFlags,
      configVer: '1.3.0',
    }

    oldPStateW.data = updatedPState
  }

  if (_.get(oldPStateW,'data.configVer') === '1.3.0') {
    // update from 1.3.0 to 1.4.0
    const {dlcFlags,gsFlags} = oldPStateW.data
    const newDlcFlags = {...dlcFlags}
    const newGsFlags = {...gsFlags};

    [100,101,102].map(id => {
      if (typeof newDlcFlags[id] !== 'boolean') {
        newDlcFlags[id] = true
      }
      if (typeof newGsFlags[id] !== 'boolean') {
        newGsFlags[id] = false
      }
    })

    const updatedPState = {
      ...oldPStateW.data,
      dlcFlags: newDlcFlags,
      gsFlags: newGsFlags,
      configVer: '1.4.0',
    }
    oldPStateW.data = updatedPState
  }

  if (_.get(oldPStateW,'data.configVer') === maxOldVersion) {
    config.set('plugin.poi-plugin-ezexped.data', oldPStateW.data)
    return oldPStateW.data
  } else {
    console.error(`Failed to update config from an old version, using default config`)
    return null
  }
}

/*
   ensure that p-state is migrated to a file and then load the content

   when this call returns, it's guaranteed that:

   - the return value should be either `null`, or a p-state of at least version 1.4.0
   - if the return value is non-null, p-state file should be properly saved
   - data in poi.config is properly cleared

 */
const migratePStateAndLoad = () => {
  // attempt to load from file,
  // if this ends up being successful, no further operations are needed.
  try {
    // it's guaranteed that a written file is at least of version 1.4.0
    // so we are fine to return it immediately
    return readJsonSync(getPStateFilePath())
  } catch (err) {
    if (err.syscall === 'open' && err.code === 'ENOENT') {
      // the file does not exist, try loading from poi.config instead
      try {
        const pState = loadAndUpdateOldPStateFromConfig()
        if (pState !== null) {
          // save current update p-state as file, but don't replace version number
          savePState(pState, false)
          const enable = Boolean(config.get('plugin.poi-plugin-ezexped.enable'))
          // clear data
          config.set('plugin.poi-plugin-ezexped',{enable})
        }
        return pState
      } catch (err2) {
        console.error('Error while reading p-state from poi config', err2)
        return null
      }
    } else {
      console.error('Error while reading p-state from file', err)
      return null
    }
  }
}

export {
  migratePStateAndLoad,
}
