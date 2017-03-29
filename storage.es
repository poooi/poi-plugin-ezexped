/*

   storage for this plugin

   the structure will be:

   - selectedExpeds: a mapping from fleetId (0..3) to a number,
     indicating the selected expedition for this fleetId
   - gsFlags: a mapping from expedition id (1..40) to a boolean,
     indicating whether the user is expecting great success

 */

const PLUGIN_KEY = "plugin-ezexped"

// generate a config with default values
const defConfig = (() => {
  const selectedExpeds = new Array(4).fill(1)
  const gsFlags = new Array(40+1).fill(false)
  const autoSwitch = true
  return { selectedExpeds, gsFlags, autoSwitch }
})()

const load = () =>
  typeof localStorage[PLUGIN_KEY] === 'undefined'
    ? defConfig
    : JSON.parse( localStorage[PLUGIN_KEY] )

// take a config modifier to modify the config stored on localStorage.
// returns the new config.
// note that the modifier should return a new config different than
// what's passed to it as an argument.
const modifyStorage = modifier => {
  const newConfig = modifier( load() )
  localStorage[PLUGIN_KEY] = JSON.stringify( newConfig )
  return newConfig
}

export {
  load,
  modifyStorage,
}
