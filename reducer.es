const mkState = () => ({
  autoSwitch: true,
  setFleet: null,
})

const reducer = (state = mkState(), action) => {
  if (action.type === "@poi-plugin-ezexped@AutoSwitchToggle") {
    return {
      ...state,
      autoSwitch: !state.autoSwitch,
    }
  }

  if (action.type === "@poi-plugin-ezexped@RegisterSetFleet") {
    return {
      ...state,
      setFleet: action.setFleet,
    }
  }

  if (state.autoSwitch && state.setFleet) {

    // do auto switch only when being asked to.
    // - "kcsapi/api_req_hensei/change"
    //     - adding one ship:    
    //     - swaping
    //     - dismiss all except flagship
    // - "kcsapi/api_req_hensei/preset_select"
    //     - using a preset

    // equip / unequip
    // - "kcsapi/api_req_kaisou/slotset"
    // - "kcsapi/api_get_member/ship3"

    // equip / unequip ex 
    // Request/kcsapi/api_req_kaisou/slotset_ex
    // Response/kcsapi/api_get_member/ship3

    // exchange
    // Response/kcsapi/api_req_kaisou/slot_exchange_index

    // unequip all
    // kcsapi/api_req_kaisou/unsetslot_all

    // deprive
    // Response/kcsapi/api_req_kaisou/slot_deprive
  }

  return state
}

const actionToggleAutoSwitch = () => {
  return {
    type: "@poi-plugin-ezexped@AutoSwitchToggle",
  }
}

const actionRegisterSetFleet = (setFleet) => {
  return {
    type: "@poi-plugin-ezexped@RegisterSetFleet",
    setFleet,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleAutoSwitch() {
      dispatch( actionToggleAutoSwitch() )
    },
    onRegisterSetFleet(setFleet) {
      dispatch( actionRegisterSetFleet( setFleet ) )
    },
  }
}

export { reducer, mapDispatchToProps }
