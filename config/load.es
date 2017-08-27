import _ from 'lodash'
import { enumFromTo } from 'subtender'

import { defaultConfig } from './common'
import { saveConfig } from './save'

// loads config from poi and perform config data update when it's necessary
const loadAndUpdateConfig = onConfigReady => {
  // TODO: latest is 1.2.0
  const latestVersion = '1.1.0'
  const {config} = window
  let oldConfig = config.get('plugin.poi-plugin-ezexped')

  // nothing to update if config version matches
  if (_.get(oldConfig,'data.configVer') === latestVersion) {
    return onConfigReady(oldConfig.data)
  }

  // recognize & update from legacy config to 1.1.0
  if (! _.get(oldConfig,'data.configVer')) {
    // copy config template
    const currentConfig = {...defaultConfig};

    // direct field copies
    [
      // 'gsFlags', 'selectedExpeds',
      'fleetAutoSwitch', 'hideMainFleet', 'hideSatReqs',
    ].map(propName => {
      const val = _.get(oldConfig,propName)
      if (typeof val !== 'undefined')
        currentConfig[propName] = val
    })

    // field name changed:
    // recommendSparkledCount => sparkledCount
    {
      const val = _.get(oldConfig,'recommendSparkledCount')
      if (typeof val !== 'undefined')
        currentConfig.sparkledCount = val
    }

    // structural changes
    {
      const val = _.get(oldConfig,'gsFlags')
      if (typeof val !== 'undefined') {
        enumFromTo(1,40).map(eId => {
          currentConfig.gsFlags[eId] = val[eId]
        })
      }
    }
    {
      const val = _.get(oldConfig,'selectedExpeds')
      if (typeof val !== 'undefined') {
        // the old version is actually using fleetInd
        enumFromTo(0,3).map(fleetInd => {
          const fleetId = fleetInd+1
          currentConfig.selectedExpeds[fleetId] = val[fleetInd]
        })
      }
    }

    oldConfig = currentConfig
    // update poi config storage by wiping old data
    // new one will be ready when all updates are done.
    const enable = !! _.get(oldConfig,'enable')
    // clear data
    config.set('plugin.poi-plugin-ezexped',{enable})
  }

  if (_.get(oldConfig,'data.configVer') === '1.0.0') {
    // update 1.0.0 to 1.1.0
    const updatedConfig = {
      ...oldConfig.data,
      syncMainFleetId: false,
      configVer: '1.1.0',
    }

    oldConfig = updatedConfig
  }

  // TODO: 1.2.0: adding 'kanceptsExportShipList' (bool)

  if (_.get(oldConfig,'data.configVer') === latestVersion) {
    saveConfig(oldConfig)
    onConfigReady(oldConfig)
  } else {
    console.error(`Failed to update config from an old version, using default config`)
    onConfigReady(defaultConfig)
  }
}

export { loadAndUpdateConfig }
