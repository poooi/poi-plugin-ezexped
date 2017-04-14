import { konst } from './utils'
const { config } = window
const { env } = process

const prodFlag = env.NODE_ENV === "production"

// path relative to store.config
const confPath = "plugin.poi-plugin-ezexped"

const configDefs = {}

// invokes the real validator only when it's not production mode
const configDefDoValidate = inst =>
  prodFlag ? konst(null) : inst.validate

// ConfigDef: config definition
// - name: key name
// - validate: validate(newValue) validates setting data.
//   returns "null" or instance of Error
// - getDefault: "getDefault()" returns the default value
class ConfigDef {
  constructor(name, getDefault, validate) {
    this.name = name
    this.getDefault = getDefault
    this.validate = validate
    this.doValidate = configDefDoValidate(this)
  }

  get path() {
    return [confPath,this.name].join(".")
  }

  get value() {
    return config.get(this.path,this.getDefault())
  }

  set value(newVal) {
    const vResult = this.doValidate(newVal)
    if (vResult !== null) {
      console.error(vResult)
      return
    }
    return config.set(this.path,newVal)
  }

  modifyValue(f) {
    const v = this.value
    this.value = f(v)
  }
}

// create and register "ConfigDef" in "configDefs"
// key: string of config name
// defValueOrFunc: if it's a function, it's set to "getDefault",
//   otherwise it's used as the default value (by reference) for that setting
const defineConfig = (name, defValueOrFunc, validate = konst(null)) => {
  const configDef = new ConfigDef(
    name,
    typeof defValueOrFunc === "function"
      ? defValueOrFunc
      : konst(defValueOrFunc),
    validate)
  configDefs[name] = configDef
}

const defineBoolConfig = (name, defValue) =>
  defineConfig(name,defValue,validateBool)

const validateBool = x => typeof x === "boolean" ? null : Error("not a bool")

defineConfig(
  "recommendSparkledCount",
  4,
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

export {
  confPath,
}
