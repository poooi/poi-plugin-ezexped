import { konst } from './utils'
const { config } = window
const { env } = process

const prodFlag = env.NODE_ENV === "production"

// path relative to store.config
const confPath = "plugin.poi-plugin-ezexped"

const configs = {}

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
    this.path = [confPath,this.name].join(".")
  }

  getValue() {
    const ret = config.get(this.path)
    return typeof ret === "undefined"
      ? this.getDefault()
      : ret
  }

  // it seems "config.set" is asynchronous. so please
  // use whatever returns from setValue(?), which is the new value
  // instead of trying to call "getValue()"
  setValue(newVal) {
    const vResult = this.doValidate(newVal)
    if (vResult !== null) {
      console.error(vResult)
      return
    }
    config.set(this.path,newVal)
    return newVal
  }

  modifyValue(f) {
    const newV = f(this.getValue())
    return this.setValue(newV)
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
  configs[name] = configDef
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
defineBoolConfig("fleetAutoSwitch", true)

defineConfig(
  "selectedExpeds",
  Object.freeze(new Array(4).fill(1)))

defineConfig(
  "gsFlags",
  Object.freeze(new Array(40+1).fill(false)))

const ezconfigs = Object.freeze( configs )

export {
  ezconfigs,
  ConfigDef,
}
