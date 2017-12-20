import _ from 'lodash'
import { observer } from 'redux-observers'
import { createStructuredSelector } from 'reselect'
import shallowEqual from 'shallowequal'

import {
  savePState,
  defaultPStateProps,
} from '../p-state'
import {
  readySelector,
  mkExtPropSelector,
} from '../selectors'

const debouncedSavePState = _.debounce(
  pStateData => setTimeout(() => savePState(pStateData)),
  500)

const extPStateSelector = createStructuredSelector({
  pState: createStructuredSelector(
    _.fromPairs(defaultPStateProps.map(propName =>
      [propName, mkExtPropSelector(propName)]))),
  ready: readySelector,
})

const pStateSaver = observer(
  extPStateSelector,
  (_dispatch, current, previous) => {
    if (current.ready === true &&
        previous.ready === true &&
        ! shallowEqual(current.pState, previous.pState)) {
      debouncedSavePState(current.pState)
    }
  }
)

export { pStateSaver }
