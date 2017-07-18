import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'

import FontAwesome from 'react-fontawesome'
import { getExpedReqs, checkAllReq, collapseResults } from '../../requirement'
import { __ } from '../../tr'
import { PTyp } from '../../ptyp'
import {
  visibleFleetsInfoSelector,
  fleetIdSelector,
  selectedExpedsSelector,
  gsFlagsSelector,
  isFleetCombinedSelector,
  fleetAutoSwitchSelector,
  sparkledCountSelector,
} from '../../selectors'
import { mapDispatchToProps as extMdtp } from '../../store'
import { modifyObject, mergeMapDispatchToProps } from '../../utils'

class FleetPickerImpl extends Component {
  static propTypes = {
    fleetId: PTyp.number.isRequired,
    selectedExpeds: PTyp.objectOf(PTyp.number).isRequired,
    gsFlags: PTyp.objectOf(PTyp.bool).isRequired,
    isFleetCombined: PTyp.bool.isRequired,
    recommendSparkled: PTyp.number.isRequired,
    fleets: PTyp.array.isRequired,
    autoSwitch: PTyp.bool.isRequired,

    modifyState: PTyp.func.isRequired,
    changeFleet: PTyp.func.isRequired,
    changeFleetFocusInMainUI: PTyp.func.isRequired,
  }

  handleToggleAutoSwitch = () =>
    this.props.modifyState(
      modifyObject(
        'fleetAutoSwitch',
        x => !x))

  render() {
    const mkTooltip = fleet =>
      (
        <Tooltip id={`fpfleet-${fleet.id}`}>
          <div style={{display: "flex", flexDirection: "column"}}>
            {
              fleet.ships.map(ship => (
                <div key={ship.rstId}>
                  {`${ship.name} (Lv. ${ship.level})`}
                </div>
              ))
            }
          </div>
        </Tooltip>
      )

    // Button color:
    // - available:
    //   - first fleet always green
    //     (for combined fleet, second fleet is always green too)
    //   - if everything is satisfied: green
    //   - if just needs resupply: yellow
    //   - otherwise red
    // - not available: always blue
    const mkButton = fleet => {
      const fleetId = fleet.id
      const expedId = this.props.selectedExpeds[fleetId]
      const greatSuccess = this.props.gsFlags[expedId]

      const eR = getExpedReqs(expedId,true,true,this.props.recommendSparkled)

      const resupplyReadyFlag = checkAllReq(eR.resupply)(fleet.ships)
      // without resupply
      const normReadyFlag =
        collapseResults( checkAllReq( eR.norm )(fleet.ships) )

      const gsReadyFlag =
        !greatSuccess ||
        (greatSuccess && collapseResults( checkAllReq( eR.gs )(fleet.ships) ))

      const bsStyle =
          fleetId === 1 ? "success"
        : this.props.isFleetCombined && fleetId === 2 ? "success"
        : !fleet.available ? "primary"
        : normReadyFlag && resupplyReadyFlag && gsReadyFlag ? "success"
        : normReadyFlag && gsReadyFlag ? "warning"
        : "danger"

      const focused = this.props.fleetId === fleetId
      const handleFocusFleetInMainUI = () =>
        this.props.changeFleetFocusInMainUI(fleetId)

      return (<Button
          bsStyle={bsStyle}
          style={{
            marginRight: "5px", flex: "1",
            opacity: focused ? "1" : "0.5",
            whiteSpace: "nowrap",
            width: "75px", overflow: "hidden"}}
          active={focused}
          onContextMenu={handleFocusFleetInMainUI}
          onClick={() => this.props.changeFleet(fleetId)}>
        <div style={{textOverflow: "ellipsis", overflow: "hidden"}} >
          {fleet.name}
        </div>
      </Button>)
    }

    const tooltipAutoSwitch = (<Tooltip id="tt-auto-btn">{__("AutoTooltip")}</Tooltip>)
    return (
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "5px",
      }}>
        <ButtonGroup style={{display: "flex", width: "80%"}}>
          {
            this.props.fleets.map(fleet => (
              <OverlayTrigger
                key={fleet.id}
                placement="bottom" overlay={mkTooltip(fleet)}>
                {mkButton(fleet)}
              </OverlayTrigger>
            ))
          }
        </ButtonGroup>
        <OverlayTrigger
          key="auto-fleet"
          placement="left" overlay={tooltipAutoSwitch}>
          <Button
            style={{display: "flex", minWidth: "40px"}}
            onClick={this.handleToggleAutoSwitch}>
            <FontAwesome
              style={{marginRight: "5px", marginTop: "2px"}}
              name={this.props.autoSwitch ? "check-square-o" : "square-o"} />
            <div style={{
              flex: "1",
              textOverflow: "ellipsis",
              overflow: "hidden"}} >{__("Auto")}</div>
          </Button>
        </OverlayTrigger>
      </div>)
  }
}

const uiSelector = createStructuredSelector({
  fleets: visibleFleetsInfoSelector,
  fleetId: fleetIdSelector,
  selectedExpeds: selectedExpedsSelector,
  gsFlags: gsFlagsSelector,
  isFleetCombined: isFleetCombinedSelector,
  autoSwitch: fleetAutoSwitchSelector,
  recommendSparkled: sparkledCountSelector,
})

const poiMdtp = dispatch => ({
  changeFleetFocusInMainUI: fleetId =>
    dispatch({
      type: '@@TabSwitch',
      tabInfo: {
        activeMainTab: 'shipView',
        activeFleetId: fleetId-1,
      },
    }),
})

const FleetPicker = connect(
  uiSelector,
  mergeMapDispatchToProps(extMdtp, poiMdtp),
)(FleetPickerImpl)

export { FleetPicker }
