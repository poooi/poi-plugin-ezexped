import { modifyObject } from 'subtender'
import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  ButtonGroup,
} from '@blueprintjs/core'

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
        <ButtonGroup fill>
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
