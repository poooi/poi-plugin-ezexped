import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Tooltip, OverlayTrigger,
} from 'react-bootstrap'

import { getExpedReqs, checkAllReq, collapseResults } from '../../requirement'
import { __ } from '../../tr'
import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'
import {
  fleetIdSelector,
  expedIdSelectorForFleet,
  gsFlagSelectorForFleet,
  mkFleetInfoSelector,
  isMainFleetFuncSelector,
  sparkledCountSelector,
} from '../../selectors'

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

class FleetButtonImpl extends Component {
  static propTypes = {
    focused: PTyp.bool.isRequired,
    fleetId: PTyp.number.isRequired,
    expedId: PTyp.number.isRequired,
    greatSuccess: PTyp.bool.isRequired,
    isFleetCombined: PTyp.bool.isRequired,
    isMainFleetFunc: PTyp.func.isRequired,
    recommendSparkled: PTyp.number.isRequired,
    fleet: PTyp.object,
    changeFleet: PTyp.func.isRequired,
    changeFleetFocusInMainUI: PTyp.func.isRequired,
  }

  static defaultProps = {
    fleet: null,
  }

  render() {
    const {
      fleet, fleetId, expedId, greatSuccess,
      isMainFleetFunc,
    } = this.props
    // Button color:
    // - available:
    //   - first fleet always green
    //     (for combined fleet, second fleet is always green too)
    //   - if everything is satisfied: green
    //   - if just needs resupply: yellow
    //   - otherwise red
    // - not available: always blue
    const eR = getExpedReqs(expedId,true,true,this.props.recommendSparkled)

    const resupplyReadyFlag = checkAllReq(eR.resupply)(fleet.ships)
    // without resupply
    const normReadyFlag =
      collapseResults( checkAllReq( eR.norm )(fleet.ships) )

    const gsReadyFlag =
      !greatSuccess ||
      (greatSuccess && collapseResults( checkAllReq( eR.gs )(fleet.ships) ))

    const bsStyle =
      isMainFleetFunc(fleetId) ? 'success'
      : !fleet.available ? 'primary'
      : normReadyFlag && resupplyReadyFlag && gsReadyFlag ? 'success'
      : normReadyFlag && gsReadyFlag ? 'warning'
      : 'danger'

    const {focused} = this.props
    const handleFocusFleetInMainUI = () =>
      this.props.changeFleetFocusInMainUI(fleetId)

    return (
      <OverlayTrigger
        placement="bottom" overlay={mkTooltip(fleet)}>
        <Button
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
        </Button>
      </OverlayTrigger>
    )
  }
}

const FleetButton = connect(
  (state, props) => {
    const {fleetId} = props
    const currentFocusingFleetId = fleetIdSelector(state)
    const expedId = expedIdSelectorForFleet(fleetId)(state)
    const greatSuccess = gsFlagSelectorForFleet(fleetId)(state)
    const fleet = mkFleetInfoSelector(fleetId)(state)
    const isMainFleetFunc = isMainFleetFuncSelector(state)
    const recommendSparkled = sparkledCountSelector(state)

    return {
      focused: fleetId === currentFocusingFleetId,
      expedId,
      greatSuccess,
      fleet,
      isMainFleetFunc,
      recommendSparkled,
    }
  },
  mapDispatchToProps,
)(FleetButtonImpl)

export { FleetButton }
