import { observe } from 'redux-observers'
import { store } from 'views/create-store'

import { configSaveObserver } from './config-save'
import { nextAvailableFleetIdObserver } from './next-fleet'

const observeAll = () =>
  observe(store, [
    configSaveObserver,
    nextAvailableFleetIdObserver,
  ])

export { observeAll }
