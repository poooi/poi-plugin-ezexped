import _ from 'lodash'
import { enumFromTo } from 'subtender'

import { defaultPState } from './common'
import { savePState } from './save'

// loads p-state from poi and perform data update when it's necessary
const loadAndUpdatePState = onPStateReady => {
  const latestVersion = '1.4.0'
  const {config} = window
  // postfixing 'W' means the actual data is wrapped in 'data' property.
  let oldPStateW = config.get('plugin.poi-plugin-ezexped')

  /*
     NOTE: "p-state" was previously called "config", therefore you might see things
     like "configVer" in updating logic
   */

  /*
     fill in default p-state when:
     - missing (first run)
     - type mismatches (shouldn't happen though)
  */
  if (_.isEmpty(oldPStateW) || typeof oldPStateW !== 'object') {
    oldPStateW = {data: defaultPState}
    // no saving on purpose, so if user doesn't change anything
    // it'll always use default of the latest version.
  }

  // INVARIANT: typeof oldPStateW === 'object'

  // nothing to update if p-state version matches
  if (_.get(oldPStateW,'data.configVer') === latestVersion) {
    return onPStateReady(oldPStateW.data)
  }

  // recognize & update from legacy p-state to 1.1.0
  if (!_.get(oldPStateW,'data.configVer')) {
    // copy p-state template
    const currentPState = {...defaultPState};

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
    // recommendSparkledCount => sparkledCount
    {
      const val = _.get(oldPStateW,'recommendSparkledCount')
      if (typeof val !== 'undefined')
        currentPState.sparkledCount = val
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
    // TODO: is this necessary?
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

  if (_.get(oldPStateW,'data.configVer') === latestVersion) {
    savePState(oldPStateW.data)
    onPStateReady(oldPStateW.data)
  } else {
    console.error(`Failed to update config from an old version, using default config`)
    onPStateReady(defaultPState)
  }
}

export { loadAndUpdatePState }
