import React, { Component } from 'react'

import {
  Panel,
} from 'react-bootstrap'

import { join } from 'path-extra'

import { FleetPicker } from './fleet-picker'
import { ExpeditionViewer } from './expedition-viewer'
import { ExpeditionTable } from './expedition-table'
import { RequirementViewer } from './requirement-viewer'

import { ezconfigs } from '../ezconfig'

import {
  findChangingFleet,
  findNextAvailableFleet,
  isSendingFleetToExped,
} from '../auto-switch'

import { modifyArray, not } from '../utils'
import { PTyp } from '../ptyp'

class EZExpedMain extends Component {
  static propTypes = {
    redux: PTyp.shape({
      fleetId: PTyp.number,
    }).isRequired,
    fleets: PTyp.array.isRequired,
    fleetAutoSwitch: PTyp.bool.isRequired,
    isFleetCombined: PTyp.bool.isRequired,
    selectedExpeds: PTyp.arrayOf(PTyp.number).isRequired,
    gsFlags: PTyp.arrayOf(PTyp.bool).isRequired,
    hideMainFleet: PTyp.bool.isRequired,
    recommendSparkledCount: PTyp.number.isRequired,
    hideSatReqs: PTyp.bool.isRequired,
    onChangeFleet: PTyp.func.isRequired,
  }

  constructor() {
    super()
    this.state = {
      expedGridExpanded: false,
    }
  }

  componentDidMount() {
    window.addEventListener('game.response', this.handleGameResponse)
  }

  componentWillReceiveProps(nextProps) {
    const { onChangeFleet } = nextProps
    const nextCurrentFleet = nextProps.redux.fleetId !== null
      && nextProps.fleets.find( fleet => fleet.index === nextProps.redux.fleetId )

    if (!nextCurrentFleet) {
      // current focus is null, we need to find a new focus
      if (nextProps.fleets.length > 0) {
        onChangeFleet(
          nextProps.fleets[0].index,
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
        onChangeFleet(
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
          onChangeFleet(
            nxt,
            "detected that we are sending a fleet out, switching to next one")
        } else {
          // nxt === null
          if (! nextProps.hideMainFleet && nextProps.fleets.length > 0) {
            onChangeFleet(
              nextProps.fleets[0].index,
              "all fleets are sent, switching to main fleet")
          }
        }
      }
    }
  }

  componentWillUnmount() {
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
          this.props.onChangeFleet(nxt, "User is at expedition screen")
        } else {
          // nxt === null
          if (! this.props.hideMainFleet && this.props.fleets.length > 0) {
            this.props.onChangeFleet(
              this.props.fleets[0].index,
              "at exped screen, no fleet available, switching to main")
          }
        }
      }
    }
  }

  selectExped = newExpedId => {
    const fleetId = this.props.redux.fleetId
    this.setState({ expedGridExpanded: false })
    ezconfigs.selectedExpeds.modifyValue(
      modifyArray(fleetId,() => newExpedId))
  }

  render() {
    const { fleetId } = this.props.redux
    const { selectedExpeds, gsFlags } = this.props
    const expedId = selectedExpeds[fleetId]
    const gsFlag = gsFlags[expedId]
    const fleet = this.props.fleets.find(flt => flt.index === fleetId) || null
    return (
      <div className="poi-plugin-ezexped">
        <link rel="stylesheet" href={join(__dirname, '..', 'assets', 'ezexped.css')} />
        <div style={{paddingRight: "5px", paddingLeft: "5px"}}>
          <FleetPicker
              fleets={this.props.fleets}
              fleetId={fleetId}
              selectedExpeds={selectedExpeds}
              gsFlags={gsFlags}
              isFleetCombined={this.props.isFleetCombined}
              autoSwitch={this.props.fleetAutoSwitch}
              recommendSparkled={this.props.recommendSparkledCount}
              onToggleAutoSwitch={() =>
                ezconfigs.fleetAutoSwitch.modifyValue(not)}
              onSelectFleet={this.props.onChangeFleet} />
          {
            fleet && (
              <ExpeditionViewer
                expedId={expedId}
                fleet={fleet}
                greatSuccess={gsFlag}
                onClickExped={() =>
                  this.setState({expedGridExpanded: !this.state.expedGridExpanded})}
                onClickGS={() =>
                  ezconfigs.gsFlags.modifyValue(
                    modifyArray(expedId,not))
                }
              />
            )
          }
          {
            fleet && (
              <Panel
                collapsible
                expanded={this.state.expedGridExpanded}
                style={{marginBottom: "5px"}} >
                <ExpeditionTable
                  fleet={fleet}
                  expedId={expedId}
                  onSelectExped={this.selectExped} />
              </Panel>
            )
          }
          {
            fleet && (
              <RequirementViewer
                fleet={fleet}
                expedId={expedId}
                greatSuccess={gsFlag}
                recommendSparkled={this.props.recommendSparkledCount}
                hideSatReqs={this.props.hideSatReqs}
              />
            )
          }
        </div>
      </div>
    )
  }
}

export {
  EZExpedMain,
}
