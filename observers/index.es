import { observe } from 'redux-observers'
import { store } from 'views/create-store'

import { configSaveObserver } from './config-save'
import { availableFleetIdsObserver } from './next-fleet'

const observeAll = () =>
  observe(store, [
    configSaveObserver,
    availableFleetIdsObserver,
  ])

export { observeAll }
