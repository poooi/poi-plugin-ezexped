import * as storage from './storage'

const loadState = () => ({
  config: storage.load(),
  fleetId: 0,
})

const reducer = (state = loadState(), action) => {
  if (action.type === "@poi-plugin-ezexped@UpdateConfig") {
    return {
      ...state,
      config: storage.modifyStorage(action.modifier),
    }
  }

  if (action.type === "@poi-plugin-ezexped@ChangeFleet") {
    return {
      ...state,
      fleetId: action.fleetId,
    }
  }


  return state
}

const mapDispatchToProps = dispatch => ({
  onModifyConfig: modifier => dispatch({
    type: "@poi-plugin-ezexped@UpdateConfig",
    modifier,
  }),
  onChangeFleet: fleetId => dispatch({
    type: "@poi-plugin-ezexped@ChangeFleet",
    fleetId,
  }),
})

export { reducer, mapDispatchToProps }
