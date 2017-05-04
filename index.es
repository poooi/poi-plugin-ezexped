import { connect } from 'react-redux'
import React, { Component } from 'react'

import { join } from 'path-extra'

import {
  mkFleetInfoSelector,
  isFleetCombinedSelector,
  reduxSelector,
  ezconfigSelector,
} from './selectors'
import { FleetPicker } from './fleet-picker'
import { ExpeditionViewer } from './expedition-viewer'
import { ExpeditionTable } from './expedition-table'
import { RequirementViewer } from './requirement-viewer'

import {
  Panel,
} from 'react-bootstrap'

import { ezconfigs } from './ezconfig'

import {
  findChangingFleet,
  findNextAvailableFleet,
  isSendingFleetToExped,
} from './auto-switch'

import { reducer, mapDispatchToProps } from './reducer'
import {
  settingsClass,
} from './settings'

import { modifyArray, not, konst } from './utils'

class EZExpedMain extends Component {
  constructor() {
    super()
    this.state = {
      expedGridExpanded: false,
    }
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

  componentDidMount() {
    this.__eventListener = this.handleGameResponse
    window.addEventListener(
      'game.response',
      this.__eventListener)
  }

  componentWillUnmount() {
    if (typeof this.__eventListener !== "undefined") {
      window.removeEventListener(
        'game.response',
        this.__eventListener)
      delete this.__eventListener
    }
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
      modifyArray(fleetId,konst(newExpedId)))
  }

  render() {
    const { fleetId } = this.props.redux
    const { selectedExpeds, gsFlags } = this.props
    const expedId = selectedExpeds[fleetId]
    const gsFlag = gsFlags[expedId]
    const fleet = this.props.fleets.find( fleet => fleet.index === fleetId ) || null
    return (
      <div className="poi-plugin-ezexped">
        <link rel="stylesheet" href={join(__dirname, 'assets', 'ezexped.css')} />
        <div style={{paddingRight: "5px", paddingLeft: "5px"}}>
          <FleetPicker
              fleets={this.props.fleets}
              fleetId={fleetId}
              selectedExpeds={selectedExpeds}
              gsFlags={gsFlags}
              isFleetCombined={this.props.isFleetCombined}
              autoSwitch={this.props.fleetAutoSwitch}
              recommendSparkled={this.props.recommendSparkled}
              onToggleAutoSwitch={() =>
                ezconfigs.fleetAutoSwitch.modifyValue(not)}
              onSelectFleet={this.props.onChangeFleet} />
          { fleet !== null && (
              <ExpeditionViewer
                  expedId={expedId}
                  fleet={fleet}
                  greatSuccess={gsFlag}
                  onClickExped={() =>
                    this.setState({expedGridExpanded: !this.state.expedGridExpanded})}
                  onClickGS={() =>
                    ezconfigs.gsFlags.modifyValue(
                      modifyArray(expedId,not))} />) }
          { fleet !== null && (
              <Panel collapsible expanded={this.state.expedGridExpanded} style={{marginBottom: "5px"}} >
                <ExpeditionTable
                    fleet={fleet}
                    expedId={expedId}
                    onSelectExped={this.selectExped} />
              </Panel>)}
          { fleet !== null && (
              <RequirementViewer
                  fleet={fleet}
                  expedId={expedId}
                  greatSuccess={gsFlag}
                  recommendSparkled={this.props.recommendSparkled}
                  hideSatReqs={this.props.hideSatReqs}
              />)}
        </div>
      </div>
    )
  }
}

const reactClass = connect(
  (state, props) => {
    const config = ezconfigSelector(state)
    const { hideMainFleet } = config
    const isFleetCombined = isFleetCombinedSelector(state)
    const fleets = []

    const beginInd = hideMainFleet
      ? (!isFleetCombined ? 1 : 2)
      : 0

    for (let fleetId=beginInd; fleetId<4; ++fleetId) {
      const fleetRep = mkFleetInfoSelector(fleetId)(state)
      if (fleetRep !== null)
        fleets.push( fleetRep )
    }

    const redux = reduxSelector(state)
    return {
      fleets,
      isFleetCombined,
      redux,
      ... config,
    }
  },
  mapDispatchToProps)(EZExpedMain)

const switchPluginPath = [
  {
    path: "/kcsapi/api_get_member/mission",
    valid: () =>
      ezconfigs.allowPluginAutoSwitch.getValue(),
  },
  {
    path: "/kcsapi/api_req_mission/result",
    valid: () =>
      ezconfigs.allowPluginAutoSwitch.getValue(),
  },
]

export {
  reactClass,
  reducer,
  settingsClass,
  switchPluginPath,
}
