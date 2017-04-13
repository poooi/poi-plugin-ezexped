import { konst } from './utils'

// path relative to store.config
const confPath = "plugin.poi-plugin-ezexped"

// ConfigDef: config definition
// - key: key name
// - validate: validate(newValue) validates setting data.
//   returns "null" or instance of Error
// - getDefault: "getDefault()" returns the default value
const configDefs = {}

// create and register "ConfigDef" in "configDefs"
// key: string of config name
// defValueOrFunc: if it's a function, it's set to "getDefault",
//   otherwise it's used as the default value (by reference) for that setting
const defineConfig = (name, defValueOrFunc, validate = konst(null)) => {
  const configDef = {
    name, validate,
    getDefault: typeof defValueOrFunc === "function"
      ? defValueOrFunc
      : konst(defValueOrFunc),
  }
  configDefs[name] = configDef
}

const defineBoolConfig = (name, defBool) =>
  defineConfig(name,defBool,validateBool)

const validateBool = x => typeof x === "boolean" ? null : Error("not a bool")

defineConfig(
  "recommendSparkledCount",
  6,
  x => {
    const ty = typeof x
    if (ty !== "number")
      return Error("not a number")
    if (ty < 0 || ty > 6)
      return Error("out of range")
    return null
  })

defineBoolConfig("allowPluginAutoSwitch", false)
defineBoolConfig("hideMainFleet", false)
defineBoolConfig("hideSatReqs", false)

// TODO
// - wrap around "config", replace all use sites of it
// - util function to help with config manipulation (get,put,modify)
// - apply validation (nop for production)

export {
  confPath,
}
