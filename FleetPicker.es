import React, { Component } from 'react'
import { 
  Button, 
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'

// props:
// - fleetId: current selected fleet id
// - fleets: array of fleet representation
// - onSelectFleet: callback when a new fleet is selected
//   this callback should accept a fleet id
class FleetPicker extends Component {
  render() {
    const mkTooltip = fleetId => { 
      const fleet = this.props.fleets[fleetId]
      return (<Tooltip>
        <div style={{display: "flex", flexDirection: "column"}}>
          {fleet.map((ship,ind) =>
            <div key={ind}>
              {`${ship.name} (Lv. ${ship.level})`}
            </div>
           )}
        </div>
      </Tooltip>)
    }
    
    return (
      <div style={{ 
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "5px",
      }}>
        <ButtonGroup style={{display: "flex", width: "80%"}}>
          {[0,1,2,3].map((x) =>
            <OverlayTrigger
                key={x}
                placement="top" overlay={mkTooltip(x)}>           
              <Button
                  style={{marginRight: "5px", flex: "1"}}
                  active={this.props.fleetId === x}
                  onClick={() => this.props.onSelectFleet(x)}>
                Fleet {x+1}
              </Button>
            </OverlayTrigger>
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
