import { observe } from 'redux-observers'
import { store } from 'views/create-store'

import { configSaveObserver } from './config-save'
import {
  expedFleetsAvailabilityObserver,
} from './next-fleet'

const observeAll = () =>
  observe(store, [
    configSaveObserver,
    expedFleetsAvailabilityObserver,
  ])

export { observeAll }
