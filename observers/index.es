import { observe } from 'redux-observers'
import { store } from 'views/create-store'

import {
  pStateSaver,
} from './p-state-saver'
import {
  expedFleetsAvailabilityObserver,
} from './next-fleet'
import {
  syncMainFleetObserver,
} from './sync-main-fleet'

let unsubscribe = null

const globalSubscribe = () => {
  if (unsubscribe !== null) {
    console.warn('expecting "unsubscribe" to be null')
    if (typeof unsubscribe === 'function')
      unsubscribe()
    unsubscribe = null
  }

  unsubscribe = observe(
    store,
    [
      pStateSaver,
      expedFleetsAvailabilityObserver,
      syncMainFleetObserver,
    ])
}

const globalUnsubscribe = () => {
  if (typeof unsubscribe !== 'function') {
    console.warn('unsubscribe is not a function')
  } else {
    unsubscribe()
  }
  unsubscribe = null
}

export {
  globalSubscribe,
  globalUnsubscribe,
}
