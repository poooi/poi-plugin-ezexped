import { bindActionCreators } from 'redux'

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
  changeFleetFocusInMainUI: fleetId => ({
    type: '@@TabSwitch',
    tabInfo: {
      activeMainTab: 'shipView',
      activeFleetId: fleetId-1,
    },
  }),
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreator, dispatch)

export {
  actionCreator,
  mapDispatchToProps,
}
