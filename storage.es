/*

   storage for this plugin

   the structure will be:

   - lastExped: a mapping from fleetId (0..3) to a number or null, 
     indicating the last expedition this fleetId has went to
   - gsFlags: a mapping from expedition id (1..40) to a boolean,
     indicating whether the user is expecting great success
   
 */

const PLUGIN_KEY = "plugin-ezexped"

// generate a config with default values
const defConfig = (() => {
  const lastExped = new Array(4).fill(null)
  const gsFlags = new Array(40+1).fill(false)
  return { lastExped, gsFlags }
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

// copy a config object
const cloneConfig = config => ({
  lastExped: [...config.lastExped],
  gsFlags: [...config.gsFlags],
})

const modifyLastExped = (fleetId,modifier) =>
  modifyStorage( config => {
    const newConfig = cloneConfig( config )
    newConfig.lastExped[fleetId] = modifier( config.lastExped[fleetId] )
    return newConfig })

const modifyGSFlags = (expedId,modifier) =>
  modifyStorage( config => {
    const newConfig = cloneConfig( config )
    newConfig.gsFlags[expedId] = modifier( config.gsFlags[expedId] )
    return newConfig })

// modify lastExped of the specified fleet, 
// return full config structure after modification
const setLastExped = (fleetId, newVal) =>
  modifyLastExped(fleetId, () => newVal)

// modify gsFlag of the specified expedition,
// return full config structure after modification
const setGSFlags = (expedId, newVal) =>
  modifyGSFlags(expedId, () => newVal)

export { 
  load,
  modifyStorage,

  setLastExped,
  setGSFlags,
}
