import { connect } from 'react-redux'
import React, { Component } from 'react'

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

   TODO

   - render requirements
   - landing craft-related calculation, on screen & on tooltip
   - consumption estimation
   - in tooltip of fleet tab, list ships in that fleet
   - Expedition Grid, give color to each of them, green when passing all checks (resupply check ignored)
   - tab autoswitch
   - record last exped through KCAPI responses
   - gs flag should be able to toggle between GS / normal calculation
   - gs flag should be able to toggle GS conditions
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
    return (
      <div style={{paddingRight: "5px", paddingLeft: "5px"}}>
        <FleetPicker
            fleetId={this.state.fleetId}
            onSelectFleet={(x) => this.setState({fleetId: x})} />
        <ExpeditionViewer
            expedId={expedId}
            greatSuccess={gsFlag}
            onClickExped={() => 
              this.setState({expedGridExpanded: !this.state.expedGridExpanded})}
            onClickGS={() =>               
              this.setState({config: storage.modifyGSFlag(expedId, x => !x)})}/>
        <Panel collapsible expanded={this.state.expedGridExpanded}>
          <ExpeditionTable
              expedId={expedId}
              onSelectExped={ (newExpedId) =>                
                this.setState({
                  config: storage.setSelectedExped(this.state.fleetId, newExpedId),
                  expedGridExpanded: false}) } />
        </Panel>
        <RequirementViewer
            fleet={this.props.fleets[ this.state.fleetId ]}
            expedId={expedId}
            greatSuccess={gsFlag}
        />
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
