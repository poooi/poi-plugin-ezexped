import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button as RButton,
  Tooltip as RTooltip,
  OverlayTrigger as ROverlayTrigger,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../ptyp'
import { __ } from '../../tr'
import { mapDispatchToProps } from '../../store'
import {
  fleetIdSelector,
  mkFleetInfoSelector,
} from '../../selectors'
import {
  fleetStateSelector,
} from './selectors'

import {
  FleetTooltipContent,
} from './fleet-tooltip-content'

import {
  FleetState,
} from './fleet-state'

class FleetButtonImpl extends Component {
  static propTypes = {
    focused: PTyp.bool.isRequired,
    fleetId: PTyp.number.isRequired,
    fleet: PTyp.object,
    fleetState: PTyp.object.isRequired,

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
    const {fleet, focused, fleetState} = this.props
    const bsStyle = FleetState.bsStyle(fleetState)
    const fleetStateDesc = FleetState.describe(fleetState)
    const shouldHide = fleetState.type === 'Main' && fleetState.shouldHide
    const content = (
      <RButton
        className="ezexped-fleet-picker-button"
        bsStyle={bsStyle}
        style={{
          flex: 1,
          opacity: focused ? 1 : .5,
          width: 75,
          display: 'flex',
          alignItems: 'center',
        }}
        active={focused}
        onContextMenu={this.handleFocusFleetInMainUI}
        onClick={this.handleChangeFleet}
      >
        <span style={{
          flex: 1,
          minWidth: 0,
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}>
          {fleet ? fleet.name : __('FleetState.NotAvail')}
        </span>
        {
          shouldHide && (
            <FontAwesome
              style={{marginLeft: '.2em'}}
              name="ban"
            />
          )
        }
      </RButton>
    )

    return fleet ? (
      <ROverlayTrigger
        placement="bottom" overlay={
          <RTooltip
            className="ezexped-pop"
            id={`ezexped-fpfleet-${fleet.id}`}>
            <FleetTooltipContent
              stateContent={fleetStateDesc}
              fleet={fleet} />
          </RTooltip>
        }>
        {content}
      </ROverlayTrigger>
    ) : content
  }
}

const FleetButton = connect(
  (state, props) => {
    const {fleetId} = props
    const currentFocusingFleetId = fleetIdSelector(state)
    const fleet = mkFleetInfoSelector(fleetId)(state)
    const fleetState = fleetStateSelector(fleetId)(state)
    return {
      focused: fleetId === currentFocusingFleetId,
      fleet,
      fleetState,
    }
  },
  mapDispatchToProps,
)(FleetButtonImpl)

export { FleetButton }
