import { bindActionCreators } from 'redux'
import { store } from 'views/create-store'

const actionCreator = {
  configReady: config => ({
    type: '@poi-plugin-ezexped@ConfigReady',
    config,
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

// TODO: simplify other parts to use this...
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
