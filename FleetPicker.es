import React, { Component } from 'react'
import { 
  Button, 
  ButtonGroup } from 'react-bootstrap'

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

export { FleetPicker }
