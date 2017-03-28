import { connect } from 'react-redux'
import React, { Component } from 'react'

import { join } from 'path-extra'

import { mkFleetInfoSelector } from './selectors'
import { FleetPicker } from './FleetPicker'
import { ExpeditionViewer } from './ExpeditionViewer'
import { ExpeditionTable } from './ExpeditionTable'
import { RequirementViewer } from './RequirementViewer'

import {
  Panel,
} from 'react-bootstrap'

import * as storage from './storage'

/*

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
              fleetId={this.state.fleetId}
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

export const reactClass = connect(
  (state, props) => {
    return {
      fleets: [0,1,2,3].map( fleetId =>
        mkFleetInfoSelector(fleetId)(state)),
    }
  })(EZExpedMain)
