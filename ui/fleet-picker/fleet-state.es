import _ from 'lodash'
import { singObj } from 'subtender'

import { __ } from '../../tr'

const fleetStates = {}

const defineFleetState = (fsName, bsStyleFuncOrStr, maker, describe) => {
  /* eslint-disable indent */
  const bsStyle =
    typeof bsStyleFuncOrStr === 'function' ? bsStyleFuncOrStr :
    typeof bsStyleFuncOrStr === 'string' ? () => bsStyleFuncOrStr :
    console.error(`unexpected bsStyle arg type: ${typeof bsStyleFuncOrStr}`)
  /* eslint-enable indent */

  fleetStates[fsName] = {
    fsName,
    bsStyle,
    maker,
    describe,
  }
}

defineFleetState(
  'Main', 'success',
  singObj('shouldHide'),
  ({shouldHide}) => shouldHide ?
    __('FleetState.MainShouldHide') : null
)

defineFleetState(
  'NotAvail', 'primary',
  () => ({}),
  () => __('FleetState.NotAvail')
)

defineFleetState(
  'OnExped', 'primary',
  singObj('expedId'),
  ({expedId}) =>
    __('FleetState.OnExped', expedId)
)

defineFleetState(
  'Ready', 'success',
  singObj('expedId'),
  ({expedId}) =>
    __('FleetState.Ready', expedId)
)

defineFleetState(
  'NeedResupply', 'warning',
  singObj('expedId'),
  ({expedId}) =>
    __('FleetState.NeedResupply', expedId)
)

defineFleetState(
  'Unmet', 'danger',
  singObj('expedId'),
  ({expedId}) =>
    __('FleetState.Unmet', expedId)
)

const dispatchMethodByType = methodName =>
  obj => fleetStates[obj.type][methodName](obj)

class FleetState {
  /*
     examples:

     - FleetState.make.Main(true)
     - FleetState.make.NotAvail()
   */
  static make = _.fromPairs(
    Object.entries(fleetStates).map(([fsName, {maker}]) =>
      [
        fsName,
        (...args) => ({
          ...maker(...args),
          type: fsName,
        }),
      ])
  )

  // get bsStyle of a fleet state
  static bsStyle = dispatchMethodByType('bsStyle')
  // get a short description for showing on UI, could be null.
  static describe = dispatchMethodByType('describe')
}

export { FleetState }
