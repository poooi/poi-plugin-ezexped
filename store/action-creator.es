import { bindActionCreators } from 'redux'
import { store } from 'views/create-store'

const actionCreator = {
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
  changeFleetFocusInMainUI: (fleetId, tabSwitch=true) => ({
    type: '@@TabSwitch',
    tabInfo: {
      activeFleetId: fleetId-1,
      ...(tabSwitch ? {activeMainTab: 'shipView'} : {}),
    },
  }),
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreator, dispatch)

const boundActionCreator =
  mapDispatchToProps(store.dispatch)

const asyncBoundActionCreator = (func, dispatch=store.dispatch) =>
  dispatch(() => setTimeout(() =>
    func(boundActionCreator)))

export {
  actionCreator,
  mapDispatchToProps,
  boundActionCreator,
  asyncBoundActionCreator,
}
