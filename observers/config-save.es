import _ from 'lodash'
import { observer } from 'redux-observers'
import { createStructuredSelector } from 'reselect'

import { shallowEqual } from '../utils'
import {
  saveConfig,
  defaultConfigProps,
} from '../config'
import {
  readySelector,
  mkExtPropSelector,
} from '../selectors'

const debouncedSaveConfig = _.debounce(
  configData => setTimeout(() => saveConfig(configData)),
  500)

const extConfigSelector = createStructuredSelector({
  config: createStructuredSelector(
    _.fromPairs(defaultConfigProps.map(propName =>
      [propName, mkExtPropSelector(propName)]))),
  ready: readySelector,
})

const configSaveObserver = observer(
  extConfigSelector,
  (_dispatch, current, previous) => {
    if (current.ready === true &&
        previous.ready === true &&
        ! shallowEqual(current.config, previous.config)) {
      debouncedSaveConfig(current.config)
    }
  }
)

export { configSaveObserver }
