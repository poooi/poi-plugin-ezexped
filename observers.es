import _ from 'lodash'
import { observer, observe } from 'redux-observers'
import { store } from 'views/create-store'

import { extConfigSelector } from './selectors'
import { shallowEqual } from './utils'
import { saveConfig } from './config'

const debouncedSaveConfig = _.debounce(
  configData => setTimeout(() => saveConfig(configData)),
  500)

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

const observeAll = () =>
  observe(store, [
    configSaveObserver,
  ])

export { observeAll }
