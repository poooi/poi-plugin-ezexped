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
    const {fleetIds} = this.props
    return (
      <ButtonGroup
        fill
        style={{
          marginBottom: 5,
          display: 'grid',
          gridTemplateColumns: `repeat(${fleetIds.length}, 1fr)`,
          justifyItems: 'stretch',
        }}
      >
        {
          fleetIds.map(fleetId => (
            <FleetButton
              key={fleetId}
              fleetId={fleetId}
            />
          ))
        }
      </ButtonGroup>
    )
  }
}

export { FleetPicker }
