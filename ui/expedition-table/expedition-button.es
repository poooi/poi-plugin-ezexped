import React, { PureComponent } from 'react'
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
class ExpeditionButton extends PureComponent {
  static propTypes = {
    ready: PTyp.bool.isRequired,
    active: PTyp.bool.isRequired,
    expedId: PTyp.number.isRequired,
    onClick: PTyp.func.isRequired,
  }

  render() {
    const {ready, expedId, onClick, active} = this.props
    const tooltip = mkExpedTooltip(expedId)
    // I don't know why but the following one isn't working:
    // const tooltip = (<ExpedTooltip expedId={expedId} />)
    return (
      <OverlayTrigger
          placement="bottom"
          overlay={tooltip}>
        <Button
            bsStyle={ready ? "primary" : "default"}
            style={{width: "100%", marginBottom: "2px"}}
            active={active}
            onClick={onClick}>
          {expedId}
        </Button>
      </OverlayTrigger>)
  }
}

export {
  ExpeditionButton,
}
