import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'

import * as estype from './estype'
import { mkFleetInfoSelector } from './selectors'

const { _, $, $$, FontAwesome } = window

import { Button, ButtonGroup, Grid, Row, Col } from 'react-bootstrap'

const enumFromTo = (frm,to,succ=(x => x+1)) => {
  const arr = []
  for (let i=frm; i<=to; i=succ(i))
    arr.push( i )
  return arr
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
      </div>
    )
  }
}

// TODO: fixing on first fleet for now for debuging.
const dbgFleetId = 3

export const reactClass = connect(
  state => ({
    fleetInfo: mkFleetInfoSelector(dbgFleetId)(state),
  }))(EZExpedMain)
