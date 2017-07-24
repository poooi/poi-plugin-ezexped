import { reducer, boundActionCreator } from './store'
import { Settings as settingsClass } from './ui/settings'
import { EZExpedMain as reactClass } from './ui'
import { observeAll } from './observers'
import { loadAndUpdateConfig } from './config'

// for observer
let unsubscribe = null

// for config loading process
let configInitId = null

const pluginDidLoad = () => {
  if (unsubscribe !== null) {
    console.error(`unsubscribe function should be null`)
  }
  unsubscribe = observeAll()

  if (configInitId !== null) {
    console.error(`configInitId should be null`)
  }
  configInitId = setTimeout(() => {
    loadAndUpdateConfig(
      boundActionCreator.configReady
    )
    configInitId = null
  })
}

const pluginWillUnload = () => {
  if (typeof unsubscribe !== 'function') {
    console.error(`invalid unsubscribe function`)
  } else {
    unsubscribe()
    unsubscribe = null
  }

  if (configInitId !== null) {
    clearTimeout(configInitId)
    configInitId = null
  }
}

const switchPluginPath = [
  {
    path: '/kcsapi/api_get_member/mission',
    valid: () => true,
  },
  {
    path: '/kcsapi/api_req_mission/result',
    valid: () => true,
  },
]

export {
  pluginDidLoad,
  pluginWillUnload,
  reactClass,
  reducer,
  settingsClass,
  switchPluginPath,
}
