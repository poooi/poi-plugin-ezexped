import { store } from 'views/create-store'

import { reducer, mapDispatchToProps } from './store'
import { Settings as settingsClass } from './ui/settings'
import { EZExpedMain as reactClass } from './ui'
import { observeAll } from './observers'
import { loadAndUpdateConfig } from './config'

/*

   TODO

   - i18n
   - fleet button tooltip: show one of the following:

      - is on expedition X
      - is ready for expedition X
      - only needs resupply for expedition X
      - has unmet requirements for expedition X

 */

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
    loadAndUpdateConfig(config =>
      store.dispatch(dispatch =>
        mapDispatchToProps(dispatch)
          .configReady(config)))

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
