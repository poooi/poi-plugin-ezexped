import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  ButtonGroup,
} from 'react-bootstrap'
import { modifyObject } from 'subtender'
import { PTyp } from '../../ptyp'
import {
  visibleFleetIdsSelector,
} from '../../selectors'
import { mapDispatchToProps } from '../../store'

import { FleetButton } from './fleet-button'

@connect(
  createStructuredSelector({
    fleetIds: visibleFleetIdsSelector,
  }),
  mapDispatchToProps,
)
class FleetPicker extends PureComponent {
  static propTypes = {
    // connected
    fleetIds: PTyp.array.isRequired,
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

export { FleetPicker }
