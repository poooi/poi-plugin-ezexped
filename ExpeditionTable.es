import React, { Component, PropTypes } from 'react'

import { enumFromTo } from './utils'

import {
  Button,
  ListGroup, ListGroupItem } from 'react-bootstrap'

// props:
// - expedId: current active expedition
// - onSelectExped: when one expedition is selected
class ExpeditionTable extends Component {
  render() {
    return (
      <div style={{display: "flex"}} >
        {enumFromTo(1,5).map(world =>
          <div key={world}
               style={{flex: "1", display: "flex", marginRight: "5px", flexDirection: "column"}}>
            { enumFromTo(1+8*(world-1), 8*world).map(expedId =>
              <Button
                  key={expedId}
                  style={ {flex: "1", marginBottom: "2px"} }
                  active={this.props.expedId === expedId}
                  onClick={() => this.props.onSelectExped(expedId)}>
                {expedId}
              </Button>)
            }
          </div>)}
      </div>)}}

export { ExpeditionTable }
