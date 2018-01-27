import { reducer, boundActionCreators } from './store'
import { Settings as settingsClass } from './ui/settings'
import { EZExpedMain as reactClass } from './ui'
import { globalSubscribe, globalUnsubscribe } from './observers'
import { loadPState } from './p-state'

const pluginDidLoad = () => {
  globalSubscribe()
  setTimeout(() =>
    boundActionCreators.pStateReady(loadPState())
  )
}

const pluginWillUnload = () => {
  globalUnsubscribe()
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
