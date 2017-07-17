import { defaultConfig } from './common'
import { loadAndUpdateConfig } from './loader'

// extract config object from a plugin state.
const stateToConfig = state =>
  Object.keys(defaultConfig).reduce(
    (conf, propName) => ({
      ...conf,
      [propName]: state[propName],
    }),
    {})

const saveConfig = configData => {
  const { config } = window
  config.set('plugin.poi-plugin-ezexped.data', configData)
}

export {
  defaultConfig,
  loadAndUpdateConfig,
  stateToConfig,
  saveConfig,
 }
