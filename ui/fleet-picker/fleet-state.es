import _ from 'lodash'
import { singObj } from 'subtender'

import { __ } from '../../tr'

const fleetStates = {}

const defineFleetState = (fsName, intentFuncOrStr, maker, describe) => {
  const intent =
    typeof intentFuncOrStr === 'function' ? intentFuncOrStr :
    typeof intentFuncOrStr === 'string' ? () => intentFuncOrStr :
    console.error(`unexpected intent arg type: ${typeof intentFuncOrStr}`)

  fleetStates[fsName] = {
    fsName,
    intent,
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

  // get intent of a fleet state
  static intent = dispatchMethodByType('intent')

  // get a short description for showing on UI, could be null.
  static describe = dispatchMethodByType('describe')
}

export { FleetState }
