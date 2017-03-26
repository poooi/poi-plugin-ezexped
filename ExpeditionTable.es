import React, { Component, PropTypes } from 'react'

import { enumFromTo } from './utils'

import {
  Button,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
} from 'react-bootstrap'

import { expedInfo } from './exped-info'

// props:
// - expedId: current active expedition
// - onSelectExped: when one expedition is selected
class ExpeditionTable extends Component {
  render() {
    const mkTooltip = expedId => {
      const info = expedInfo[expedId]
      const resourceSum = 
        Object.keys(info.resource)
              .map( k => info.resource[k])
              .reduce((x,y)=>x+y,0)

      const progressBar = (
        <ProgressBar min={0} max={resourceSum}>
          <ProgressBar
              min={0} max={resourceSum}
              bsStyle="success"
              now={info.resource.fuel} key={1} />
          <ProgressBar
              min={0} max={resourceSum}
              bsStyle="danger"
              now={info.resource.ammo} key={2} />
          <ProgressBar
              min={0} max={resourceSum}
              bsStyle="info"
              now={info.resource.steel} key={3} />
          <ProgressBar
              min={0} max={resourceSum}
              bsStyle="warning"
              now={info.resource.bauxite} key={4} />
        </ProgressBar>
      )
      return (
        <Tooltip id={`tooltip-${expedId}`} style={{display: "flex", flexDirection: "column" /*, width: "150px" */}}>
          <div>{info.name}</div>
          <div>{["fuel","ammo","steel","bauxite"].map(k => info.resource[k]).join(", ")}</div>
          { false
            /* perhaps don't do this for now... */
            && resourceSum > 0 && progressBar }
        </Tooltip>)
    }
    return (
      <div style={{display: "flex"}} >
        {enumFromTo(1,5).map(world =>
          <div key={world}
               style={{flex: "1", display: "flex", marginRight: "5px", flexDirection: "column"}}>
            { enumFromTo(1+8*(world-1), 8*world).map(expedId =>
              <OverlayTrigger placement="bottom" overlay={mkTooltip(expedId)}>
                <Button
                    key={expedId}
                    style={ {flex: "1", marginBottom: "2px"} }
                    active={this.props.expedId === expedId}
                    onClick={() => this.props.onSelectExped(expedId)}>
                  {expedId}
                </Button>
              </OverlayTrigger>)
            }
          </div>)}
      </div>)}}

export { ExpeditionTable }
