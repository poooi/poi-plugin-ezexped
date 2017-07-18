import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  Panel,
} from 'react-bootstrap'

import {
  createStructuredSelector,
} from 'reselect'

import { join } from 'path-extra'

import { FleetPicker } from './fleet-picker'
import { ExpeditionViewer } from './expedition-viewer'
import { ExpeditionTable } from './expedition-table'
import { RequirementViewer } from './requirement-viewer'

import {
  findChangingFleet,
} from '../auto-switch'
import { PTyp } from '../ptyp'
import { mapDispatchToProps } from '../store'

import {
  fleetIdSelector,
  visibleFleetsInfoSelector,
  fleetAutoSwitchSelector,
  expedTableExpandedSelector,
  fleetInfoSelector,
} from '../selectors'

class EZExpedMainImpl extends Component {
  static propTypes = {
    fleetId: PTyp.number.isRequired,
    fleets: PTyp.array.isRequired,
    fleetAutoSwitch: PTyp.bool.isRequired,
    expedTableExpanded: PTyp.bool.isRequired,
    fleet: PTyp.object,

    changeFleet: PTyp.func.isRequired,
  }

  static defaultProps = {
    fleet: null,
  }

  componentWillReceiveProps(nextProps) {
    // TODO: better handle this in observer
    const { changeFleet } = nextProps
    const nextCurrentFleet = nextProps.fleetId !== null
      && nextProps.fleets.find( fleet => fleet.id === nextProps.fleetId )

    if (!nextCurrentFleet) {
      // current focus is null, we need to find a new focus
      if (nextProps.fleets.length > 0) {
        changeFleet(
          nextProps.fleets[0].id,
          "initializing fleet focus")
      }
      return
    }

    if (nextProps.fleetAutoSwitch
        && this.props.fleets.length === nextProps.fleets.length) {
      const changingFleetInd = findChangingFleet(
        this.props.fleets,
        nextProps.fleets)
      if (changingFleetInd !== null) {
        changeFleet(
          changingFleetInd,
          "detected changing fleet")
      }
    }
  }

  render() {
    const {
      expedTableExpanded,
      fleet,
    } = this.props
    return (
      <div className="poi-plugin-ezexped">
        <link rel="stylesheet" href={join(__dirname, '..', 'assets', 'ezexped.css')} />
        <div style={{paddingRight: "5px", paddingLeft: "5px"}}>
          <FleetPicker />
          {
            fleet && (
              <ExpeditionViewer />
            )
          }
          {
            fleet && (
              <Panel
                collapsible
                expanded={expedTableExpanded}
                style={{marginBottom: "5px"}} >
                <ExpeditionTable />
              </Panel>
            )
          }
          {
            fleet && (
              <RequirementViewer />
            )
          }
        </div>
      </div>
    )
  }
}

const mainUISelector = createStructuredSelector({
  fleet: fleetInfoSelector,
  fleets: visibleFleetsInfoSelector,
  fleetId: fleetIdSelector,
  fleetAutoSwitch: fleetAutoSwitchSelector,
  expedTableExpanded: expedTableExpandedSelector,
})

const EZExpedMain = connect(
  mainUISelector,
  mapDispatchToProps
)(EZExpedMainImpl)

export {
  EZExpedMain,
}
