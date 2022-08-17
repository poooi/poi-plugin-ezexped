import { join } from 'path-extra'
import React, { PureComponent } from 'react'
import {
  Button,
  Classes,
  Position,
} from '@blueprintjs/core'
import styled from 'styled-components'
import { Tooltip } from 'views/components/etc/overlay'
import { PTyp } from '../../../../ptyp'
import { ExpedTooltipContent } from './exped-tooltip-content'

const ETooltip = styled(Tooltip)`
  & .${Classes.POPOVER_TARGET} {
    width: 100%;
  }
`

const ThisTooltip = styled(ETooltip)`
  max-width: 150px;
  width: 100%;
  grid-area: ${({gridRow}) => gridRow} / ${({gridCol}) => gridCol};
  height: 1.8em;
  margin: 0;
  padding: 0;

  & .${Classes.POPOVER_TARGET} {
    width: 100%;
    height: 100%;
  }

  & .${Classes.POPOVER_TARGET} button {
    height: 100%;
    min-height: 100%;
  }
`

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
    btnClassName: PTyp.string,

    gridRow: PTyp.number.isRequired,
    gridCol: PTyp.number.isRequired,
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
      getExpedInfo,
      gridRow, gridCol,
    } = this.props

    return (
      <ThisTooltip
        wrapperTagName="div"
        targetTagName="div"
        position={Position.BOTTOM}
        gridRow={gridRow}
        gridCol={gridCol}
        content={(
          <ExpedTooltipContent
            getExpedInfo={getExpedInfo}
            expedId={expedId}
          />
        )}
      >
        <Button
          className={[Classes.POPOVER_DISMISS,btnClassName].join(' ')}
          intent={ready ? 'primary' : 'none'}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
                src={join(__dirname,'..','..','..','..','assets','images',`fleet-${runningFleetId}.png`)}
              />
            )
          }
        </Button>
      </ThisTooltip>
    )
  }
}

export {
  ExpeditionButton,
}
