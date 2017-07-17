import _ from 'lodash'
import { createSelector } from 'reselect'

import { stateToConfig } from '../config'
import { extSelector } from '../selectors'


/*
   this selector collects slices of interest from plugin state,
   and wraps it under `config` property of the returning structure,
   additionallys `ready` flag is provided to distinguish between
   a real config and a default one (this happens when configs are
   not yet loaded or the main state is not available).

   NOTE: avoid using this selector if the subscriber is not interested
   in knowing whether the config is real.
 */

const extConfigSelector = createSelector(
  extSelector,
  ext => {
    const config = stateToConfig(ext)
    const {ready} = ext
    return {config, ready}
  })

export { extConfigSelector }
