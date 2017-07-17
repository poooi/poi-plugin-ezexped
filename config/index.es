import { defaultConfig } from './common'
import { loadAndUpdateConfig } from './load'
import { saveConfig } from './save'

// extract config object from a plugin state.
const stateToConfig = state =>
  Object.keys(defaultConfig).reduce(
    (conf, propName) => ({
      ...conf,
      [propName]: state[propName],
    }),
    {})

export {
  defaultConfig,
  loadAndUpdateConfig,
  saveConfig,
  stateToConfig,
}
