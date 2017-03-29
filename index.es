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

import * as storage from './storage'

import { reducer, mapDispatchToProps } from './reducer'



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

  componentDidMount() {
	console.log("did mount")
    this.props.onRegisterSetFleet( (fleetId) =>
      this.setState( {fleetId} ) )
	console.log("reg")
  }

  componentWillUnmount() {
    console.log("unmount")
    this.props.onRegisterSetFleet( null )
    console.log("unreg")
  }

  render() {
    console.log("hello")
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
              redux={this.props.redux}
              onToggleAutoSwitch={this.props.onToggleAutoSwitch}
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
    const redux = reduxSelector(state)
    return { fleets, fleetsExtra, combinedFlag, redux }
  },
  mapDispatchToProps)(EZExpedMain)

export { 
  reactClass,
  reducer,
}
