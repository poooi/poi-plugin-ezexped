import { connect } from 'react-redux'
import React, { Component } from 'react'

import { join } from 'path-extra'

import {
  mkFleetInfoSelector,
  combinedFlagSelector,
  reduxSelector,
} from './selectors'
import { FleetPicker } from './FleetPicker'
import { ExpeditionViewer } from './ExpeditionViewer'
import { ExpeditionTable } from './ExpeditionTable'
import { RequirementViewer } from './RequirementViewer'

import {
  Panel,
} from 'react-bootstrap'

import { get } from 'lodash'

import {
  findChangingFleet,
  findNextAvailableFleet,
  isSendingFleetToExped,
} from './auto-switch'

import { reducer, mapDispatchToProps } from './reducer'
import {
  keyRecommendSparkled,
  keyAllowSwitch,
  keyHideMainFleet,
  keyHideSatReqs,
  settingsClass,
} from './Settings'

const { getStore } = window

/*

   TODO (non-urgent)

   - utilize React PropTypes

 */

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

    if (nextProps.redux.config.autoSwitch
        && this.props.fleets.length === nextProps.fleets.length) {
      const changingFleetInd = findChangingFleet(
        this.props.fleets,
        nextProps.fleets)
      if (changingFleetInd !== false) {
        onChangeFleet(
          changingFleetInd,
          "detected changing fleet")
      }

      if (isSendingFleetToExped(
        this.props.fleets,
        nextProps.fleets,
        nextProps.combinedFlag)) {
        onChangeFleet(
          findNextAvailableFleet(
            nextProps.fleets,
            nextProps.combinedFlag,
            nextProps.hideMainFleet),
         "detected that we are sending a fleet out, switching to next one")
      }
    }
  }

  componentDidMount() {
    this.__eventListener = this.handleGameResponse.bind(this)
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

  handleGameResponse(e) {
    const path = e.detail.path
    if (this.props.redux.config.autoSwitch) {
      if (path === "/kcsapi/api_get_member/mission") {
        const nxt = findNextAvailableFleet(
          this.props.fleets,
          this.props.combinedFlag,
          this.props.hideMainFleet)
        this.props.onChangeFleet(nxt, "User is at expedition screen")
      }
    }
  }

  selectExped = newExpedId => {
    const fleetId = this.props.redux.fleetId
    this.setState({ expedGridExpanded: false })
    this.props.onModifyConfig( config => {
      const newConfig = { ... config }
      newConfig.selectedExpeds = [ ... config.selectedExpeds ]
      newConfig.selectedExpeds[fleetId] = newExpedId
      return newConfig
    })
  }

  render() {
    const config = this.props.redux.config
    const fleetId = this.props.redux.fleetId
    const expedId = config.selectedExpeds[fleetId]
    const gsFlag = config.gsFlags[expedId]
    const fleet = this.props.fleets.find( fleet => fleet.index === fleetId ) || null
    return (
      <div className="poi-plugin-ezexped">
        <link rel="stylesheet" href={join(__dirname, 'assets', 'ezexped.css')} />
        <div style={{paddingRight: "5px", paddingLeft: "5px"}}>
          <FleetPicker
              fleets={this.props.fleets}
              fleetId={fleetId}
              config={config}
              combinedFlag={this.props.combinedFlag}
              autoSwitch={config.autoSwitch}
              recommendSparkled={this.props.recommendSparkled}
              onToggleAutoSwitch={() =>
                this.props.onModifyConfig( config => ({
                  ...config,
                  autoSwitch: !config.autoSwitch,
                }))}
              onSelectFleet={this.props.onChangeFleet} />
          { fleet !== null && (
              <ExpeditionViewer
                  expedId={expedId}
                  fleet={fleet}
                  greatSuccess={gsFlag}
                  onClickExped={() =>
                    this.setState({expedGridExpanded: !this.state.expedGridExpanded})}
                  onClickGS={() =>
                    this.props.onModifyConfig( config => {
                      const newConfig = { ... config }
                      newConfig.gsFlags = [ ... config.gsFlags ]
                      newConfig.gsFlags[expedId] = !config.gsFlags[expedId]
                      return newConfig
                    })} />) }
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
    const recommendSparkled = get(state.config, keyRecommendSparkled)
    const hideMainFleet = get(state.config, keyHideMainFleet)
    const hideSatReqs = get(state.config, keyHideSatReqs)
    const combinedFlag = combinedFlagSelector(state)
    const fleets = []

    const beginInd = hideMainFleet
      ? (combinedFlag === 0 ? 1 : 2)
      : 0

    for (let fleetId=beginInd; fleetId<4; ++fleetId) {
      const fleetRep = mkFleetInfoSelector(fleetId)(state)
      if (fleetRep !== null)
        fleets.push( fleetRep )
    }

    const redux = reduxSelector(state)
    return {
      fleets,
      combinedFlag,
      redux,
      recommendSparkled,
      hideMainFleet,
      hideSatReqs,
    }
  },
  mapDispatchToProps)(EZExpedMain)

const switchPluginPath = [
  {
    path: "/kcsapi/api_get_member/mission",
    valid: () => getStore( "config." + keyAllowSwitch ),
  },
]

export {
  reactClass,
  reducer,
  settingsClass,
  switchPluginPath,
}
