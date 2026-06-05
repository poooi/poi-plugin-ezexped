import { bindActionCreators } from 'redux'
import { store } from 'views/create-store'

const _createTabSwitchAction = (() => {
  try {
    const { createTabSwitchAction } = require('views/redux/actions/ui')
    if (typeof createTabSwitchAction === 'function') {
      return createTabSwitchAction
    }
  } catch (e) {
    // module not found -> legacy poi
  }
  return null
})()

const actionCreators = {
  pStateReady: pState => ({
    type: '@poi-plugin-ezexped@PStateReady',
    pState,
  }),
  changeFleet: (fleetId,reason=null) => ({
    type: '@poi-plugin-ezexped@ChangeFleet',
    fleetId,
    reason,
  }),
  modifyState: modifier => ({
    type: '@poi-plugin-ezexped@ModifyState',
    modifier,
  }),
  // note that this action is handled only when 'fleetAutoSwitch' is on
  autoSwitchToNextAvailable: (reason=null) => ({
    type: '@poi-plugin-ezexped@AutoSwitchToNextAvailable',
    reason,
  }),
  changeFleetFocusInMainUI: (fleetId, tabSwitch=true) => {
    const tabInfo = {
      activeFleetId: fleetId-1,
      ...(tabSwitch ? {activeMainTab: 'shipView'} : {}),
    }
    if (_createTabSwitchAction) {
      return _createTabSwitchAction({ tabInfo })
    }
    return { type: '@@TabSwitch', tabInfo }
  },
  setWidth: width => ({
    type: '@poi-plugin-ezexped@SetWidth',
    width,
  }),
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch)

const boundActionCreators =
  mapDispatchToProps(store.dispatch)

const asyncBoundActionCreators = (func, dispatch=store.dispatch) =>
  dispatch(() => setTimeout(() =>
    func(boundActionCreators)))

export {
  actionCreators,
  mapDispatchToProps,
  boundActionCreators,
  asyncBoundActionCreators,
}
