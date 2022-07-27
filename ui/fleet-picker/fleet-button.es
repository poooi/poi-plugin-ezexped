import React, { Component } from 'react'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import styled from 'styled-components'
import { Button, Position } from '@blueprintjs/core'
import { Tooltip } from 'views/components/etc/overlay'

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

const FPButton = styled(Button)`
  & > span.bp4-button-text {
    display: block;
    align-items: center;
    min-width: 0;
    overflow: hidden;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const FP0Button = styled(FPButton)`
  width: 0;
`

const FTooltip = styled(Tooltip)`
  flex: 1 1 0;

  & > span.bp4-popover-target {
    display: flex;
    width: 100%;
  }
`

@connect(
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
)
class FleetButton extends Component {
  static propTypes = {
    focused: PTyp.bool.isRequired,
    fleetId: PTyp.number.isRequired,
    fleet: PTyp.object,
    fleetState: PTyp.object.isRequired,
    // connected
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
    const intent = FleetState.intent(fleetState)
    const fleetStateDesc = FleetState.describe(fleetState)
    const shouldHide = fleetState.type === 'Main' && fleetState.shouldHide
    const FButton = fleet ? FP0Button : FPButton
    const content = (
      <FButton
        className="ezexped-fleet-picker-button"
        intent={intent}
        style={{
          opacity: focused ? 1 : .5,
          flex: '1 1 0',
          display: 'flex',
        }}
        icon={
          shouldHide && (
            <FontAwesome
              style={{marginLeft: '.2em'}}
              name="ban"
            />
          )
        }
        active={focused}
        onContextMenu={this.handleFocusFleetInMainUI}
        onClick={this.handleChangeFleet}
        text={fleet ? fleet.name : __('FleetState.NotAvail')}
      />
    )

    return fleet ? (
      <FTooltip
        content={(
          <FleetTooltipContent
            stateContent={fleetStateDesc}
            fleet={fleet}
          />
        )}
        position={Position.BOTTOM}
      >
        {content}
      </FTooltip>
    ) : content
  }
}

export { FleetButton }
