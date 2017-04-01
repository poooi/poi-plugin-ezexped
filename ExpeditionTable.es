import React, { Component, PropTypes } from 'react'

import { enumFromTo } from './utils'
import { expedReqs, checkAllReq, collapseResults } from './requirement'

import {
  Button,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'

import { expedInfo } from './exped-info'
const { _ } = window

const checkWithoutResupply = (fleet, expedId) => {
  const req = expedReqs[expedId]
    .filter( req => Array.isArray(req) || req.data.type !== "Resupply" )
  const result = checkAllReq( req )(fleet)
  return collapseResults(result)
}

const mkExpedTooltip = expedId => {
  const info = expedInfo[expedId]
  return (
    <Tooltip id={`tooltip-${expedId}`} style={{display: "flex", flexDirection: "column"}}>
      <div>{info.name}</div>
      <div>{["fuel","ammo","steel","bauxite"].map(k => info.resource[k]).join(", ")}</div>
    </Tooltip>)
}

// const ExpedTooltip = props => mkExpedTooltip(props.expedId)

// every expedition button inside the table
// props:
// - ready: boolean for telling if this expedition is ready
// - active: if this component should appear like it's the selected exped
// - expedId: the expedition id this button is representing for
// - onSelectedExped
class ExpeditionButton extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.ready !== nextProps.ready ||
      this.props.active !== nextProps.active ||
      this.props.expedId !== nextProps.expedId
  }

  selectExped = () =>
    this.props.onSelectExped(this.props.expedId)

  render () {
    const props = this.props
    const expedId = props.expedId
    const tooltip = mkExpedTooltip(expedId)
    // I don't know why but the following one isn't working:
    // const tooltip = (<ExpedTooltip expedId={expedId} />)
    return (
      <OverlayTrigger 
          placement="bottom" 
          overlay={tooltip}>
        <Button
            bsStyle={props.ready ? "primary" : "default"}
            style={{width: "100%", marginBottom: "2px"}}
            active={props.active}
            onClick={this.selectExped}>
          {props.expedId}
        </Button>
      </OverlayTrigger>)
  }
}

// props:
// - expedId: current active expedition
// - onSelectExped: when one expedition is selected
// - fleet: fleet representation
class ExpeditionTable extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.expedId !== nextProps.expedId ||
      ! _.isEqual(this.props.fleet,nextProps.fleet)
  }

  render() {
    const isReadyArr = new Array(40+1)
    enumFromTo(1,40)
      .map( expedId => 
        isReadyArr[expedId] = checkWithoutResupply(this.props.fleet,expedId) )
    return (
      <div style={{display: "flex"}} >
        {enumFromTo(1,5).map(world =>
          <div key={world}
               style={{flex: "1", display: "flex", marginRight: "5px", flexDirection: "column"}}>
            { enumFromTo(1+8*(world-1), 8*world).map(expedId =>
              <ExpeditionButton
                  key={expedId}
                  ready={isReadyArr[expedId]}
                  active={this.props.expedId === expedId} 
                  expedId={expedId}
                  onSelectExped={this.props.onSelectExped} />)
            }
          </div>)}
      </div>)}}

export { ExpeditionTable }
