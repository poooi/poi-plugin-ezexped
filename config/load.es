import _ from 'lodash'
import { enumFromTo } from '../utils'

import { defaultConfig } from './common'
import { saveConfig } from './save'

// loads config from poi and perform config data update when it's necessary
const loadAndUpdateConfig = onConfigReady => {
  const { config } = window
  const rawConfig = config.get('plugin.poi-plugin-ezexped')

  // nothing to update if config version matches
  if (_.get(rawConfig,'data.configVer') === defaultConfig.configVer) {
    return onConfigReady(rawConfig.data)
  }

  if (_.get(rawConfig,'data.configVer') === '1.0.0') {
    // update 1.0.0 to 1.1.0
    const updatedConfig = {
      ...rawConfig.data,
      syncMainFleetId: false,
      configVer: '1.1.0',
    }

    setTimeout(() => {
      saveConfig(updatedConfig)
    })
    return onConfigReady(updatedConfig)
  }

  // need to update config
  const currentConfig = {...defaultConfig};

  // direct field copies
  [
    // 'gsFlags', 'selectedExpeds',
    'fleetAutoSwitch', 'hideMainFleet', 'hideSatReqs',
  ].map(propName => {
    const val = _.get(rawConfig,propName)
    if (typeof val !== 'undefined')
      currentConfig[propName] = val
  })

  // field name changed:
  // recommendSparkledCount => sparkledCount
  {
    const val = _.get(rawConfig,'recommendSparkledCount')
    if (typeof val !== 'undefined')
      currentConfig.sparkledCount = val
  }

  // structural changes
  {
    const val = _.get(rawConfig,'gsFlags')
    if (typeof val !== 'undefined') {
      enumFromTo(1,40).map(eId => {
        currentConfig.gsFlags[eId] = val[eId]
      })
    }
  }
  {
    const val = _.get(rawConfig,'selectedExpeds')
    if (typeof val !== 'undefined') {
      // the old version is actually using fleetInd
      enumFromTo(0,3).map(fleetInd => {
        const fleetId = fleetInd+1
        currentConfig.selectedExpeds[fleetId] = val[fleetInd]
      })
    }
  }

  // update poi config storage by wiping old data
  // and setting new one
  setTimeout(() => {
    const enable = !! _.get(rawConfig,'enable')
    // clear data
    config.set('plugin.poi-plugin-ezexped',{enable})
    // set new config
    saveConfig(currentConfig)
  })

  return onConfigReady(currentConfig)
}

export { loadAndUpdateConfig }
