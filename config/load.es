import _ from 'lodash'
import { enumFromTo } from 'subtender'

import { defaultConfig } from './common'
import { saveConfig } from './save'

// loads config from poi and perform config data update when it's necessary
const loadAndUpdateConfig = onConfigReady => {
  const latestVersion = '1.4.0'
  const {config} = window
  // postfixing 'W' means the actual data is wrapped in 'data' property.
  let oldConfigW = config.get('plugin.poi-plugin-ezexped')

  /*
     fill in default config when:
     - missing (first run)
     - type mismatches (shouldn't happen though)
  */
  if (_.isEmpty(oldConfigW) || typeof oldConfigW !== 'object') {
    oldConfigW = {data: defaultConfig}
    // no saving on purpose, so if user doesn't change anything
    // it'll always use default of the latest version.
  }

  // INVARIANT: typeof oldConfigW === 'object'

  // nothing to update if config version matches
  if (_.get(oldConfigW,'data.configVer') === latestVersion) {
    return onConfigReady(oldConfigW.data)
  }

  // recognize & update from legacy config to 1.1.0
  if (!_.get(oldConfigW,'data.configVer')) {
    // copy config template
    const currentConfig = {...defaultConfig};

    // direct field copies
    [
      // 'gsFlags', 'selectedExpeds',
      'fleetAutoSwitch', 'hideMainFleet', 'hideSatReqs',
    ].map(propName => {
      const val = _.get(oldConfigW,propName)
      if (typeof val !== 'undefined')
        currentConfig[propName] = val
    })

    // field name changed:
    // recommendSparkledCount => sparkledCount
    {
      const val = _.get(oldConfigW,'recommendSparkledCount')
      if (typeof val !== 'undefined')
        currentConfig.sparkledCount = val
    }

    // structural changes
    {
      const val = _.get(oldConfigW,'gsFlags')
      if (typeof val !== 'undefined') {
        enumFromTo(1,40).map(eId => {
          currentConfig.gsFlags[eId] = val[eId]
        })
      }
    }
    {
      const val = _.get(oldConfigW,'selectedExpeds')
      if (typeof val !== 'undefined') {
        // the old version is actually using fleetInd
        enumFromTo(0,3).map(fleetInd => {
          const fleetId = fleetInd+1
          currentConfig.selectedExpeds[fleetId] = val[fleetInd]
        })
      }
    }

    oldConfigW.data = currentConfig
    // update poi config storage by wiping old data
    // new one will be ready when all updates are done.
    const enable = !! _.get(oldConfigW,'enable')
    // clear data
    config.set('plugin.poi-plugin-ezexped',{enable})
  }

  if (_.get(oldConfigW,'data.configVer') === '1.0.0') {
    // update from 1.0.0 to 1.1.0
    const updatedConfig = {
      ...oldConfigW.data,
      syncMainFleetId: false,
      configVer: '1.1.0',
    }

    oldConfigW.data = updatedConfig
  }

  if (_.get(oldConfigW,'data.configVer') === '1.1.0') {
    // update from 1.1.0 to 1.2.0
    const updatedConfig = {
      ...oldConfigW.data,
      kanceptsExportShipList: true,
      configVer: '1.2.0',
    }

    oldConfigW.data = updatedConfig
  }

  if (_.get(oldConfigW,'data.configVer') === '1.2.0') {
    // update from 1.2.0 to 1.3.0
    const dlcFlags = _.fromPairs(enumFromTo(1,40).map(eId => [eId, true]))
    const updatedConfig = {
      ...oldConfigW.data,
      dlcFlags,
      configVer: '1.3.0',
    }

    oldConfigW.data = updatedConfig
  }

  if (_.get(oldConfigW,'data.configVer') === '1.3.0') {
    // update from 1.3.0 to 1.4.0
    const {dlcFlags,gsFlags} = oldConfigW.data
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

    const updatedConfig = {
      ...oldConfigW.data,
      dlcFlags: newDlcFlags,
      gsFlags: newGsFlags,
      configVer: '1.4.0',
    }
    oldConfigW.data = updatedConfig
  }

  if (_.get(oldConfigW,'data.configVer') === latestVersion) {
    saveConfig(oldConfigW.data)
    onConfigReady(oldConfigW.data)
  } else {
    console.error(`Failed to update config from an old version, using default config`)
    onConfigReady(defaultConfig)
  }
}

export { loadAndUpdateConfig }
