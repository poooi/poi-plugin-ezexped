import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  extensionSelectorFactory,
} from 'views/utils/selectors'

import { initState } from '../store'
import { stateToConfig } from '../config'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-ezexped'),
  ext => _.isEmpty(ext) ? initState : ext)

const extConfigSelector = createSelector(
  extSelector,
  ext => {
    const config = stateToConfig(ext)
    const {ready} = ext
    return {config, ready}
  })

export {
  extSelector,
  extConfigSelector,
}
