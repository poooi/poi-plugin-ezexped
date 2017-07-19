import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Tooltip, OverlayTrigger,
} from 'react-bootstrap'
import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'
import {
  fleetIdSelector,
  mkFleetInfoSelector,
} from '../../selectors'
import {
  mkBsStyleForFleetButtonSelector,
} from './selectors'

import {
  FleetTooltipContent,
} from './fleet-tooltip-content'

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
    fleet: PTyp.object,
    bsStyle: PTyp.string.isRequired,

    changeFleet: PTyp.func.isRequired,
    changeFleetFocusInMainUI: PTyp.func.isRequired,
  }

  static defaultProps = {
    fleet: null,
  }

  handleFocusFleetInMainUI = () => {
    const {fleetId, changeFleetFocusInMainUI} = this.props
    changeFleetFocusInMainUI(fleetId)
  }

  handleChangeFleet = () => {
    const {fleetId, changeFleet} = this.props
    changeFleet(fleetId)
  }

  render() {
    const {fleet, bsStyle, focused} = this.props
    return (
      <OverlayTrigger
        placement="bottom" overlay={
          <Tooltip id={`ezexped-fpfleet-${fleet.id}`}>
            <FleetTooltipContent
              fleet={fleet} />
          </Tooltip>
        }>
        <Button
          bsStyle={bsStyle}
          style={{
            marginRight: 5, flex: 1,
            opacity: focused ? 1 : .5,
            whiteSpace: 'nowrap',
            width: 75,
            overflow: 'hidden',
          }}
          active={focused}
          onContextMenu={this.handleFocusFleetInMainUI}
          onClick={this.handleChangeFleet}
        >
          <div style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}>
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
    const fleet = mkFleetInfoSelector(fleetId)(state)
    const bsStyle = mkBsStyleForFleetButtonSelector(fleetId)(state)
    return {
      focused: fleetId === currentFocusingFleetId,
      fleet,
      bsStyle,
    }
  },
  mapDispatchToProps,
)(FleetButtonImpl)

export { FleetButton }
