import { connect } from 'react-redux'
import React, { Component } from 'react'

import { join } from 'path-extra'

import { 
  mkFleetInfoSelector,
  combinedFlagSelector,
} from './selectors'
import { FleetPicker } from './FleetPicker'
import { ExpeditionViewer } from './ExpeditionViewer'
import { ExpeditionTable } from './ExpeditionTable'
import { RequirementViewer } from './RequirementViewer'

import {
  Panel,
} from 'react-bootstrap'

const { _ } = window

import * as storage from './storage'

/*

   TODO

   - i18n

   TODO (non-urgent)

   - tab autoswitch
   - record last exped through KCAPI responses
   - utilize React PropTypes

 */

class EZExpedMain extends Component {
  constructor() {
    super()
    this.state = {
      fleetId: 0,
      expedGridExpanded: false,
      config: storage.load(),
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.config.autoSwitch) {
      const curFleets = this.props.fleets
      const nextFleets = nextProps.fleets

      // compare fleet one-by-one, and determine which one is the one
      // that we are operating:
      // if there's only one changing fleet, that should be it.
      // otherwise, if there is more than one changing fleet,
      // take the first one that "increases" somehow: either it has an increasing number
      // of ships or has an increasing number of equipments.
      const compared = curFleets.map( (fleet,ind) => {
        const nextFleet = nextFleets[ind]
        return _.isEqual(fleet,nextFleet)
      })
      const changingCount = compared.filter(x => !x).length

      const isIncreasing = (beforeFleet,afterFleet) => {
        if (beforeFleet.length !== afterFleet.length)
          return beforeFleet.length < afterFleet.length
        const eqListBefore = [].concat( ... beforeFleet.map(s => s.equips))
        const eqListAfter = [].concat( ... afterFleet.map(s => s.equips))
        return eqListBefore.length < eqListAfter.length
      }

      if (changingCount === 1) {
        this.setState({fleetId: compared.indexOf(false) })
      } else if (changingCount > 1) {
        // multiple fleets are updated
        for (let i=0; i<compared.length;++i) {
          if (compared[i])
            continue

          const fleet = curFleets[i]
          const nextFleet = nextFleets[i]
          if (isIncreasing(fleet,nextFleet)) {
            this.setState({fleetId: i})
            break
          }
          
        }
      }
      
      /*
         TODO: this is better handled by monitoring network
         because there are cases that network won't cause a state change.

      // auto switch when expeditions are sent
      // first let's make sure this is not a change about combined fleet state
      if (! _.isEqual(this.props.fleetsExtra,nextProps.fleetsExtra)
          &&  this.props.combinedFlag === nextProps.combinedFlag) {
        const beginFleet = this.props.combinedFlag === 0 ? 1 : 2

        for (let i = beginFleet; i<nextProps.fleetsExtra.length; ++i) {
          if (nextProps.fleetsExtra[i].available) {
            this.setState({fleetId: i})
            break
          }
        }
      }
      */
      
    }
  }

  render() {
    const expedId = this.state.config.selectedExpeds[this.state.fleetId]
    const gsFlag = this.state.config.gsFlags[expedId]
    const fleet = this.props.fleets[ this.state.fleetId ]
    return (
      <div className="poi-plugin-ezexped">
        <link rel="stylesheet" href={join(__dirname, 'assets', 'ezexped.css')} />
        <div style={{paddingRight: "5px", paddingLeft: "5px"}}>
          <FleetPicker
              fleets={this.props.fleets}
              fleetsExtra={this.props.fleetsExtra}
              fleetId={this.state.fleetId}
              config={this.state.config}
              combinedFlag={this.props.combinedFlag}
              autoSwitch={this.state.config.autoSwitch}
              onToggleAutoSwitch={ () => this.setState({
                config: storage.modifyStorage( config => (
                  { ... config, autoSwitch: !config.autoSwitch }
                ))})}
              onSelectFleet={(x) => this.setState({fleetId: x})} />
          <ExpeditionViewer
              expedId={expedId}
              fleet={fleet}
              greatSuccess={gsFlag}
              onClickExped={() => 
                this.setState({expedGridExpanded: !this.state.expedGridExpanded})}
              onClickGS={() =>               
                this.setState({config: storage.modifyGSFlag(expedId, x => !x)})}/>
          <Panel collapsible expanded={this.state.expedGridExpanded} style={{marginBottom: "5px"}} >
            <ExpeditionTable
                fleet={fleet}
                expedId={expedId}
                onSelectExped={ (newExpedId) =>                
                  this.setState({
                    config: storage.setSelectedExped(this.state.fleetId, newExpedId),
                    expedGridExpanded: false}) } />
          </Panel>
          <RequirementViewer
              fleet={fleet}
              expedId={expedId}
              greatSuccess={gsFlag}
          />
        </div>
      </div>
    )
  }
}

const reactClass = connect(
  (state, props) => {
    const combinedFlag = combinedFlagSelector(state)
    const fleets = []
    const fleetsExtra = [];

    [0,1,2,3].map( fleetId => {
      const {fleet,fleetExtra} = mkFleetInfoSelector(fleetId)(state)
      fleets[fleetId] = fleet
      fleetsExtra[fleetId] = fleetExtra
    })
    return { fleets, fleetsExtra, combinedFlag }
  })(EZExpedMain)

export { 
  reactClass,
}
