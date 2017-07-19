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
import { __ } from '../../tr'
import { PTyp } from '../../ptyp'
import {
  visibleFleetIdsSelector,
  fleetAutoSwitchSelector,
} from '../../selectors'
import { mapDispatchToProps } from '../../store'
import { modifyObject } from '../../utils'
import { FleetButton } from './fleet-button'

class FleetPickerImpl extends Component {
  static propTypes = {
    fleetIds: PTyp.array.isRequired,
    autoSwitch: PTyp.bool.isRequired,
    modifyState: PTyp.func.isRequired,
  }

  handleToggleAutoSwitch = () =>
    this.props.modifyState(
      modifyObject(
        'fleetAutoSwitch',
        x => !x))

  render() {
    return (
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "5px",
      }}>
        <ButtonGroup style={{display: "flex", width: "80%"}}>
          {
            this.props.fleetIds.map(fleetId => (
              <FleetButton
                key={fleetId}
                fleetId={fleetId}
              />
            ))
          }
        </ButtonGroup>
        <OverlayTrigger
          key="auto-fleet"
          placement="left"
          overlay={
            <Tooltip id="ezexped-auto-btn-tooltip">
              {__("AutoTooltip")}
            </Tooltip>
          }>
          <Button
            style={{display: 'flex', minWidth: 40}}
            onClick={this.handleToggleAutoSwitch}>
            <FontAwesome
              style={{marginRight: 5, marginTop: 2}}
              name={
                this.props.autoSwitch ?
                  'check-square-o' :
                  'square-o'
              }
            />
            <div style={{
              flex: "1",
              textOverflow: "ellipsis",
              overflow: "hidden"}} >
              {__("Auto")}
            </div>
          </Button>
        </OverlayTrigger>
      </div>)
  }
}

const uiSelector = createStructuredSelector({
  fleetIds: visibleFleetIdsSelector,
  autoSwitch: fleetAutoSwitchSelector,
})

const FleetPicker = connect(
  uiSelector,
  mapDispatchToProps,
)(FleetPickerImpl)

export { FleetPicker }
