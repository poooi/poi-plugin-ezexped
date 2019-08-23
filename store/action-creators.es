import { bindActionCreators } from 'redux'
import { store } from 'views/create-store'

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
  changeFleetFocusInMainUI: (fleetId, tabSwitch=true) => ({
    type: '@@TabSwitch',
    tabInfo: {
      activeFleetId: fleetId-1,
      ...(tabSwitch ? {activeMainTab: 'shipView'} : {}),
    },
  }),
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
