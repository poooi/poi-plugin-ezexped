import { join } from 'path-extra'
import React, { PureComponent } from 'react'
import {
  Button,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

import { ExpedTooltipContent } from './exped-tooltip-content'

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
    runningFleetId: PTyp.number,
    onClick: PTyp.func.isRequired,
    btnClassName: PTyp.string,
  }

  static defaultProps = {
    runningFleetId: null,
    btnClassName: '',
  }

  render() {
    const {
      ready, expedId, onClick,
      active, runningFleetId,
      btnClassName,
    } = this.props
    return (
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id={`ezexped-tooltip-${expedId}`}>
            <ExpedTooltipContent expedId={expedId} />
          </Tooltip>
        }>
        <Button
          className={btnClassName}
          bsStyle={ready ? "primary" : "default"}
          style={{
            width: '100%',
            marginBottom: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          active={active}
          onClick={onClick}>
          <span>
            {expedId}
          </span>
          {
            runningFleetId && (
              <img
                style={{height: '1.1em', marginLeft: '.6em'}}
                alt={`/${runningFleetId}`}
                src={join(__dirname,'..','..','assets','images',`fleet-${runningFleetId}.png`)}
              />
            )
          }
        </Button>
      </OverlayTrigger>)
  }
}

export {
  ExpeditionButton,
}
