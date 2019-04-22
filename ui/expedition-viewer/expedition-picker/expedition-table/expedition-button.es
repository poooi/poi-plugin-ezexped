import { join } from 'path-extra'
import React, { PureComponent } from 'react'
import {
  OverlayTrigger as ROverlayTrigger,
  Tooltip as RTooltip,
} from 'react-bootstrap'
import {
  Button,
  Classes,
} from '@blueprintjs/core'

import { PTyp } from '../../../../ptyp'
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
    getExpedInfo: PTyp.func.isRequired,
    onClick: PTyp.func.isRequired,
    style: PTyp.object,
    btnClassName: PTyp.string,
  }

  static defaultProps = {
    runningFleetId: null,
    btnClassName: '',
    style: {},
  }

  render() {
    const {
      ready, expedId, onClick,
      active, runningFleetId,
      btnClassName,
      getExpedInfo, style,
    } = this.props

    // TODO: Button is good enough for now, but we'll need to get inner
    // wrapped layout right (e.g. set display: flex)
    return (
      <ROverlayTrigger
        placement="bottom"
        overlay={
          <RTooltip id={`ezexped-tooltip-${expedId}`}>
            <ExpedTooltipContent
              getExpedInfo={getExpedInfo}
              expedId={expedId}
            />
          </RTooltip>
        }>
        <Button
          className={[Classes.POPOVER_DISMISS,btnClassName].join(' ')}
          intent={ready ? "primary" : "none"}
          style={{
            maxWidth: 150,
            width: '100%',
            height: '1.8em',
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...style,
          }}
          active={active}
          onClick={onClick}>
          <span>
            {getExpedInfo(expedId).displayNum}
          </span>
          {
            runningFleetId && (
              <img
                style={{height: '1.1em', marginLeft: '.6em'}}
                alt={`/${runningFleetId}`}
                src={
                  join(
                    __dirname,'..','..','..','..',
                    'assets','images',`fleet-${runningFleetId}.png`
                  )
                }
              />
            )
          }
        </Button>
      </ROverlayTrigger>
    )
  }
}

export {
  ExpeditionButton,
}
