/*

   storage for this plugin

   the structure will be:

   - selectedExpeds: a mapping from fleetId (0..3) to a number,
     indicating the selected expedition for this fleetId
   - gsFlags: a mapping from expedition id (1..40) to a boolean,
     indicating whether the user is expecting great success

 */

const PLUGIN_KEY = "plugin-ezexped"

import { ezconfigs } from './ezconfig'

// TODO: remove migration code after few releases
// moving settings in localStorage to config
const doMigration = () => {
  const confRaw = localStorage[PLUGIN_KEY]
  if (typeof confRaw === 'undefined')
    return

  const conf = JSON.parse( confRaw )

  ezconfigs.fleetAutoSwitch.setValue(conf.autoSwitch)

  ezconfigs.selectedExpeds.setValue(conf.selectedExpeds)
  ezconfigs.gsFlags.setValue(conf.gsFlags)

  delete localStorage[PLUGIN_KEY]
}

// want this to happen as soon as it loads
doMigration()

// for keeping export list not empty,
// just in case that dead code elimination thinks itself is smart
export const nop = () => null
