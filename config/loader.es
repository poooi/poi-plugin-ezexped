import _ from 'lodash'
import { enumFromTo } from '../utils'

import { defaultConfig } from './common'

// loads config from poi and perform config data update when it's necessary
const loadAndUpdateConfig = onConfigReady => {
  const { config } = window
  const rawConfig = config.get('plugin.poi-plugin-ezexped')

  // nothing to update if config version matches
  if (_.get(rawConfig,'data.configVer') === defaultConfig.configVer) {
    return onConfigReady(rawConfig.data)
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
      enumFromTo(0,3).map(fleetInd => {
        currentConfig.selectedExpeds[fleetInd] = val[fleetInd]
      })
    }
  }

  // TODO: remove old data (perhaps asynchronously)
  return onConfigReady(currentConfig)
}

export { loadAndUpdateConfig }
