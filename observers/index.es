import { observe } from 'redux-observers'
import { store } from 'views/create-store'

import {
  configSaveObserver,
} from './config-save'
import {
  expedFleetsAvailabilityObserver,
} from './next-fleet'
import {
  syncMainFleetObserver,
} from './sync-main-fleet'

const observeAll = () =>
  observe(store, [
    configSaveObserver,
    expedFleetsAvailabilityObserver,
    syncMainFleetObserver,
  ])

export { observeAll }
