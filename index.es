import { reducer, boundActionCreator } from './store'
import { Settings as settingsClass } from './ui/settings'
import { EZExpedMain as reactClass } from './ui'
import { globalSubscribe, globalUnsubscribe } from './observers'
import { loadAndUpdateConfig } from './config'

// for config loading process
let configInitId = null

/*
   TODO
   - switch to use file-based persistent state
   - failure record as file
   - move "auto switch" into settings
 */

const pluginDidLoad = () => {
  globalSubscribe()

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
  globalUnsubscribe()

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
