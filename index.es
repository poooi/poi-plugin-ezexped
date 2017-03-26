import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'

import * as estype from './estype'
import { mkFleetInfoSelector } from './selectors'
import { enumFromTo } from './utils'
import { FleetPicker } from './FleetPicker'
import { expedInfo } from './exped-info'

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

// props:
// - expedId: expedition id
// - onClick
class ExpeditionViewer extends Component {
  render() {
    const info = expedInfo[ this.props.expedId ]
    console.log(info)
    return (
      <div style={{display: "flex"}}>
        <div style={{flex: "6", display: "flex", flexDirection: "column"}}>
          <Button onClick={this.props.onClick}>
            {this.props.expedId} {info.name}
        </Button>
        <div>Required Time: 19:26 </div>
        <div><MaterialIcon materialId={1} className="material-icon" />{info.cost.fuelPercent}%,
             <MaterialIcon materialId={2} className="material-icon" />{info.cost.ammoPercent}%</div>
      </div>
      <div style={{ 
        flex: "3", display:"flex",
        justifyContent: "space-around", flexDirection: "column"}}>
        <div><MaterialIcon materialId={1} className="material-icon" />{info.resource.fuel}</div>
        <div><MaterialIcon materialId={2} className="material-icon" />{info.resource.ammo}</div>
      </div>
      <div style={{flex: "3", display:"flex", 
                   justifyContent: "space-around", flexDirection: "column"}}>
        <div><MaterialIcon materialId={3} className="material-icon" />{info.resource.steel}</div>
        <div><MaterialIcon materialId={4} className="material-icon" />{info.resource.bauxite}</div>
      </div>
      <div style={{flex: "2", display:"flex",
                   justifyContent: "space-around", flexDirection: "column"}}>
        <div>Prob. Itm</div>
        <div>GS Itm</div>
      </div>
      <Button style={{flex: "1"}}>
        <FontAwesome name="check-square-o" />
        GS
      </Button>
      </div>
    )
  }
}

class EZExpedMain extends Component {
  constructor() {
    super()
    this.state = {
      curFleetId: 0,
      curExpedId: 21,
      expedGridExpanded: false,
    }
  }
  render() {
    return (
      <div style={{paddingRight: "5px", paddingLeft: "5px"}}>
        <FleetPicker
            fleetId={this.state.curFleetId}
            onSelectFleet={(x) => this.setState({curFleetId: x}) } />
        <ExpeditionViewer
            expedId={this.state.curExpedId}
            onClick={() => this.setState({expedGridExpanded: !this.state.expedGridExpanded}) }
      />
      <Panel collapsible expanded={this.state.expedGridExpanded}>
        <div style={{display: "flex"}} >
          {enumFromTo(1,5).map(world =>
          <div key={world} 
               style={{flex: "1", display: "flex", marginRight: "5px", flexDirection: "column"}}>
            { enumFromTo(1+8*(world-1), 8*world).map(expedId =>
            <Button
                key={expedId}
                style={ {flex: "1", marginBottom: "2px"} }
                active={this.state.curExpedId === expedId}
                onClick={ () => this.setState({curExpedId: expedId, expedGridExpanded: false})}>
              {expedId}
            </Button>)
            }
          </div>)}
          </div>
        </Panel>
        <RequirementList
            fleet={this.props.fleets[ this.state.curFleetId ]}
            expedId={this.state.curExpedId}
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
