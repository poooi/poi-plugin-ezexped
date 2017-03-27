import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'

import * as estype from './estype'
import { mkFleetInfoSelector } from './selectors'
import { enumFromTo } from './utils'
import { FleetPicker } from './FleetPicker'
import { ExpeditionViewer } from './ExpeditionViewer'
import { ExpeditionTable } from './ExpeditionTable'

const { _, $, $$, FontAwesome } = window

import {
  Button,
  ButtonGroup,
  Grid, Row, Col,
  ButtonToolbar, DropdownButton, MenuItem,
  Panel,
  ListGroup, ListGroupItem } from 'react-bootstrap'

import { expedReqs, expedGSReqs, checkAllReq, collectUnmetReqs, renderReqData } from './requirement'

import { MaterialIcon } from 'views/components/etc/icon'

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

 */

class RequirementList extends Component {
  render() {
    const fleet = this.props.fleet
    const reqObj = expedReqs[ this.props.expedId ]
    const result = checkAllReq(reqObj)(fleet)
    const unmetReqs = collectUnmetReqs(reqObj,result).map( x => renderReqData(x.data) )
    const reqObjGS = expedGSReqs[ this.props.expedId ]
    const gsResult = checkAllReq(reqObjGS)(fleet)
    const unmetReqsGS = collectUnmetReqs(reqObjGS,gsResult).map( x => "GS:"+ renderReqData(x.data) )
    return (
      <ListGroup>
        {
          [...unmetReqs, ...unmetReqsGS].map((x,ind)=>
            <ListGroupItem key={ind}>
              {x}
            </ListGroupItem>)
        }
      </ListGroup>
    )
  }
}

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
        <RequirementList
            fleet={this.props.fleets[ this.state.fleetId ]}
            expedId={expedId}
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
