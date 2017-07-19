import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Tooltip, OverlayTrigger,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'
import {
  hideMainFleetSelector,
  isMainFleetFuncSelector,
  fleetIdSelector,
  mkFleetInfoSelector,
} from '../../selectors'
import {
  mkBsStyleForFleetButtonSelector,
} from './selectors'

import {
  FleetTooltipContent,
} from './fleet-tooltip-content'

class FleetButtonImpl extends Component {
  static propTypes = {
    focused: PTyp.bool.isRequired,
    fleetId: PTyp.number.isRequired,
    fleet: PTyp.object,
    bsStyle: PTyp.string.isRequired,
    shouldHide: PTyp.bool.isRequired,

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
    const {fleet, bsStyle, focused, shouldHide} = this.props
    const content = (
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
        <span style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}>
          {fleet.name}
        </span>
        {
          shouldHide && (
            <FontAwesome
              style={{marginLeft: '.2em'}}
              name="ban"
            />
          )
        }
      </Button>
    )

    return fleet ? (
      <OverlayTrigger
        placement="bottom" overlay={
          <Tooltip
            className="ezexped-pop"
            id={`ezexped-fpfleet-${fleet.id}`}>
            <FleetTooltipContent
              fleet={fleet} />
          </Tooltip>
        }>
        {content}
      </OverlayTrigger>
    ) : content
  }
}

const FleetButton = connect(
  (state, props) => {
    const {fleetId} = props
    const currentFocusingFleetId = fleetIdSelector(state)
    const fleet = mkFleetInfoSelector(fleetId)(state)
    const bsStyle = mkBsStyleForFleetButtonSelector(fleetId)(state)
    const hideMainFleet = hideMainFleetSelector(state)
    const isMainFleetFunc = isMainFleetFuncSelector(state)
    const shouldHide = hideMainFleet && isMainFleetFunc(fleetId)
    return {
      focused: fleetId === currentFocusingFleetId,
      fleet,
      bsStyle,
      shouldHide,
    }
  },
  mapDispatchToProps,
)(FleetButtonImpl)

export { FleetButton }
