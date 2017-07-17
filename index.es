import { reducer } from './store'
import { Settings as settingsClass } from './ui/settings'
import { EZExpedMain as reactClass } from './ui'

/*

   TODO

   - reduxify states and move some logic part into selectors
   - redo requirement implementation, allow alternative fleet compo
   - fleet tooltip redo, might include morale & related equips (DLC & drum)
   - exped table: fleet tag on buttons for showing which fleet is currently running that exped

 */

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
  reactClass,
  reducer,
  settingsClass,
  switchPluginPath,
}
