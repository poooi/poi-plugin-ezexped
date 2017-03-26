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
      expedId: 21,
      expedGridExpanded: false,
      greatSuccess: true,
    }
  }
  render() {
    return (
      <div style={{paddingRight: "5px", paddingLeft: "5px"}}>
        <FleetPicker
            fleetId={this.state.fleetId}
            onSelectFleet={(x) => this.setState({fleetId: x}) } />
        <ExpeditionViewer
            expedId={this.state.expedId}
            greatSuccess={this.state.greatSuccess}
            onClickExped={() => this.setState({expedGridExpanded: !this.state.expedGridExpanded}) }
            onClickGS={() => this.setState({greatSuccess: !this.state.greatSuccess})}
      />
      <Panel collapsible expanded={this.state.expedGridExpanded}>
        <ExpeditionTable
            expedId={this.state.expedId}
            onSelectExped={ (newExpedId) =>
              this.setState({expedId: newExpedId, expedGridExpanded: false}) }
        />
        </Panel>
        <RequirementList
            fleet={this.props.fleets[ this.state.fleetId ]}
            expedId={this.state.expedId}
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
