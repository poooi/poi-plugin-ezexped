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
  ListGroup, ListGroupItem } from 'react-bootstrap'

import { expedReqs, expedGSReqs, checkAllReq, collectUnmetReqs } from './requirement'

const enumFromTo = (frm,to,succ=(x => x+1)) => {
  const arr = []
  for (let i=frm; i<=to; i=succ(i))
    arr.push( i )
  return arr
}

class TestComponent extends Component {
  render() {
    return (
      <ButtonToolbar>
        <DropdownButton bsSize="large" title="Large button" id="dropdown-size-large">
          <MenuItem eventKey="1">Action</MenuItem>
          <MenuItem eventKey="2">Another action</MenuItem>
          <MenuItem eventKey="3">Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="4">Separated link</MenuItem>
        </DropdownButton>
      </ButtonToolbar>)}}

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

class EZExpedMain extends Component {
  constructor() {
    super()
    this.state = {
      curFleetId: 0,
      curExpedId: 21,
    }
  }
  render() {
    return (
      <div>
        <ButtonGroup>
          {[0,1,2,3].map((x) =>
            <Button
                key={x}
                active={this.state.curFleetId === x}
                onClick={() => this.setState({curFleetId: x})}>Fleet {x+1}</Button>
           )}
        </ButtonGroup>
        <Grid>{
          enumFromTo(1,5).map(world => 
           <Row className="show-grid" key={world}>
              {enumFromTo(1+8*(world-1), 8*world).map(expedId =>
                <Col xs={1} md={1} key={expedId}>
                  <Button
                    style={ {width: "40px"} }
                    active={this.state.curExpedId === expedId}
                    onClick={ () => this.setState({curExpedId: expedId})}>
                    {expedId}
                  </Button>
                </Col>)}
           </Row>)}
        </Grid>
        <RequirementList
            fleet={this.props.fleets[ this.state.curFleetId ]}
            expedId={this.state.curExpedId}
        />
        <TestComponent />
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
