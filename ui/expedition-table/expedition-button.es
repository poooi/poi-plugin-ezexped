import _ from 'lodash'
import React, { Component } from 'react'
import {
  Button,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'

import { expedInfo } from '../../exped-info'
import { PTyp } from '../../ptyp'

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
  static propTypes = {
    ready: PTyp.bool.isRequired,
    active: PTyp.bool.isRequired,
    expedId: PTyp.number.isRequired,
    onSelectExped: PTyp.func.isRequired,
  }
  shouldComponentUpdate(nextProps) {
    return this.props.ready !== nextProps.ready ||
      this.props.active !== nextProps.active ||
      this.props.expedId !== nextProps.expedId
  }

  selectExped = () =>
    this.props.onSelectExped(this.props.expedId)

  render() {
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

export {
  ExpeditionButton,
}
