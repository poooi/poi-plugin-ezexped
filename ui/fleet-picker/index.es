import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'
import { modifyObject } from 'subtender'
import FontAwesome from 'react-fontawesome'
import { __ } from '../../tr'
import { PTyp } from '../../ptyp'
import {
  visibleFleetIdsSelector,
  fleetAutoSwitchSelector,
} from '../../selectors'
import { mapDispatchToProps } from '../../store'

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
      >
        <ButtonGroup
          style={{
            display: 'flex',
            width: '100%',
          }}
        >
          {
            this.props.fleetIds.map(fleetId => (
              <FleetButton
                key={fleetId}
                fleetId={fleetId}
              />
            ))
          }
        </ButtonGroup>
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
