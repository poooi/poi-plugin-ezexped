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

import { loadAndUpdateConfig } from '../config'
import {
  findChangingFleet,
  findNextAvailableFleet,
  isSendingFleetToExped,
} from '../auto-switch'
import { PTyp } from '../ptyp'
import { observeAll } from '../observers'
import { mapDispatchToProps } from '../store'

import {
  fleetIdSelector,
  visibleFleetsInfoSelector,
  fleetAutoSwitchSelector,
  isFleetCombinedSelector,
  hideMainFleetSelector,
  expedTableExpandedSelector,
  fleetInfoSelector,
} from '../selectors'

class EZExpedMainImpl extends Component {
  static propTypes = {
    fleetId: PTyp.number.isRequired,
    fleets: PTyp.array.isRequired,
    fleetAutoSwitch: PTyp.bool.isRequired,
    isFleetCombined: PTyp.bool.isRequired,
    hideMainFleet: PTyp.bool.isRequired,
    expedTableExpanded: PTyp.bool.isRequired,
    fleet: PTyp.object,

    changeFleet: PTyp.func.isRequired,
    configReady: PTyp.func.isRequired,
  }

  static defaultProps = {
    fleet: null,
  }

  constructor(props) {
    super(props)
    this.unsubscribe = null
  }

  componentDidMount() {
    setTimeout(() => loadAndUpdateConfig(this.props.configReady))
    window.addEventListener('game.response', this.handleGameResponse)

    if (this.unsubscribe !== null) {
      console.error(`unsubscribe function should be null`)
    }
    this.unsubscribe = observeAll()
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

      if (isSendingFleetToExped(
        this.props.fleets,
        nextProps.fleets,
        nextProps.isFleetCombined)) {
        const nxt = findNextAvailableFleet(
          nextProps.fleets,
          nextProps.isFleetCombined)

        if (nxt !== null) {
          changeFleet(
            nxt,
            "detected that we are sending a fleet out, switching to next one")
        } else {
          // nxt === null
          if (! nextProps.hideMainFleet && nextProps.fleets.length > 0) {
            changeFleet(
              nextProps.fleets[0].id,
              "all fleets are sent, switching to main fleet")
          }
        }
      }
    }
  }

  componentWillUnmount() {
    if (typeof this.unsubscribe !== 'function') {
      console.error(`invalid unsubscribe function`)
    } else {
      this.unsubscribe()
      this.unsubscribe = null
    }
    // TODO: use observer
    window.removeEventListener('game.response', this.handleGameResponse)
  }

  handleGameResponse = e => {
    const path = e.detail.path
    if (this.props.fleetAutoSwitch) {
      if (path === "/kcsapi/api_get_member/mission") {
        const nxt = findNextAvailableFleet(
          this.props.fleets,
          this.props.isFleetCombined,
          this.props.hideMainFleet)
        if (nxt !== null) {
          this.props.changeFleet(nxt, "User is at expedition screen")
        } else {
          // nxt === null
          if (! this.props.hideMainFleet && this.props.fleets.length > 0) {
            this.props.changeFleet(
              this.props.fleets[0].id,
              "at exped screen, no fleet available, switching to main")
          }
        }
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
  isFleetCombined: isFleetCombinedSelector,
  fleetId: fleetIdSelector,
  fleetAutoSwitch: fleetAutoSwitchSelector,
  hideMainFleet: hideMainFleetSelector,
  expedTableExpanded: expedTableExpandedSelector,
})

const EZExpedMain = connect(
  mainUISelector,
  mapDispatchToProps
)(EZExpedMainImpl)

export {
  EZExpedMain,
}
