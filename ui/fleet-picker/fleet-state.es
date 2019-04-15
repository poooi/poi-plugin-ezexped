import _ from 'lodash'
import { singObj } from 'subtender'

import { __ } from '../../tr'

const fleetStates = {}

const defineFleetState = (fsName, bsStyleFuncOrStr, maker, describe) => {
  const bsStyle =
    typeof bsStyleFuncOrStr === 'function' ? bsStyleFuncOrStr :
    typeof bsStyleFuncOrStr === 'string' ? () => bsStyleFuncOrStr :
    console.error(`unexpected bsStyle arg type: ${typeof bsStyleFuncOrStr}`)

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
  singObj('displayNum'),
  ({displayNum}) =>
    __('FleetState.OnExped', displayNum)
)

defineFleetState(
  'Ready', 'success',
  singObj('displayNum'),
  ({displayNum}) =>
    __('FleetState.Ready', displayNum)
)

defineFleetState(
  'NeedResupply', 'warning',
  singObj('displayNum'),
  ({displayNum}) =>
    __('FleetState.NeedResupply', displayNum)
)

defineFleetState(
  'Unmet', 'danger',
  singObj('displayNum'),
  ({displayNum}) =>
    __('FleetState.Unmet', displayNum)
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
