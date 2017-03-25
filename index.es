import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'

import * as estype from './estype'
import { mkFleetInfoSelector } from './selectors'

const { _, $, $$, FontAwesome } = window

import { 
  Button, 
  ButtonGroup, 
  Grid, Row, Col, 
  ButtonToolbar, DropdownButton, MenuItem,
  Panel,
  ListGroup, ListGroupItem } from 'react-bootstrap'

import { expedReqs, expedGSReqs, checkAllReq, collectUnmetReqs } from './requirement'

const enumFromTo = (frm,to,succ=(x => x+1)) => {
  const arr = []
  for (let i=frm; i<=to; i=succ(i))
    arr.push( i )
  return arr
}

class RequirementList extends Component {
  render() {
    const fleet = this.props.fleet
    const reqObj = expedReqs[ this.props.expedId ]
    const result = checkAllReq(reqObj)(fleet)
    const unmetReqs = collectUnmetReqs(reqObj,result).map( x => x.renderStr() )
    const reqObjGS = expedGSReqs[ this.props.expedId ]
    const gsResult = checkAllReq(reqObjGS)(fleet)
    const unmetReqsGS = collectUnmetReqs(reqObjGS,gsResult).map( x => "GS:"+ x.renderStr() )
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
// - fleetId: current selected fleet id
// - onSelectFleet: callback when a new fleet is selected
//   this callback should accept a fleet id
class FleetPicker extends Component {
  render() {
    return (
      <div style={{ 
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "5px",
      }}>
        <ButtonGroup style={{display: "flex", width: "80%"}}>
          {[0,1,2,3].map((x) =>
            <Button
              style={{marginRight: "5px", flex: "1"}}
              key={x}
              active={this.props.fleetId === x}
              onClick={() => this.props.onSelectFleet(x)}>Fleet {x+1}</Button>
          )}
        </ButtonGroup>
        <Button 
            key="auto-fleet"
            disabled={true}
            active={false}>
          Auto
        </Button>
      </div>)}}

// props:
// - expedId: expedition id
// - onClick
class ExpeditionViewer extends Component {
  render() {
    return (
      <div>
        <Button onClick={this.props.onClick}>
          Expedition #{this.props.expedId}
        </Button>
        I'll do this later™
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
      expedGridExpanded: true,
    }
  }
  render() {
    return (
      <div style={{padding: "5px"}}>
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
