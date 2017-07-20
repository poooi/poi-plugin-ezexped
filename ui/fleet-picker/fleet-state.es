import _ from 'lodash'
import { singObj } from '../../utils'

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
    'Will be hidden' : null
)

defineFleetState(
  'NotAvail', 'primary',
  () => ({}),
  () => 'Not Available'
)

defineFleetState(
  'OnExped', 'primary',
  singObj('expedId'),
  ({expedId}) =>
    `Running Expedition #${expedId}`
)

defineFleetState(
  'Ready', 'success',
  singObj('expedId'),
  ({expedId}) =>
    `Ready for Expedition #${expedId}`
)

defineFleetState(
  'NeedResupply', 'warning',
  singObj('expedId'),
  ({expedId}) =>
    `Need Resupply for Expedition ${expedId}`
)

defineFleetState(
  'Unmet', 'danger',
  singObj('expedId'),
  ({expedId}) =>
    `Requirement Unmet for Expedition ${expedId}`
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
