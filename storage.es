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
  return { selectedExpeds, gsFlags }
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
  selectedExpeds: [...config.selectedExpeds],
  gsFlags: [...config.gsFlags],
})

const modifySelectedExped = (fleetId,modifier) =>
  modifyStorage( config => {
    const newConfig = cloneConfig( config )
    newConfig.selectedExpeds[fleetId] = modifier( config.selectedExpeds[fleetId] )
    return newConfig })

const modifyGSFlag = (expedId,modifier) =>
  modifyStorage( config => {
    const newConfig = cloneConfig( config )
    newConfig.gsFlags[expedId] = modifier( config.gsFlags[expedId] )
    return newConfig })

// modify selectedExped of the specified fleet, 
// return full config structure after modification
const setSelectedExped = (fleetId, newVal) =>
  modifySelectedExped(fleetId, () => newVal)

// modify gsFlag of the specified expedition,
// return full config structure after modification
const setGSFlag = (expedId, newVal) =>
  modifyGSFlag(expedId, () => newVal)

export { 
  load,
  modifyStorage,

  modifySelectedExped,
  setSelectedExped,

  modifyGSFlag,
  setGSFlag,
}
