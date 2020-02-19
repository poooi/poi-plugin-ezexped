import React, { PureComponent } from 'react'
import FontAwesome from 'react-fontawesome'
import {
  Position,
} from '@blueprintjs/core'
import {
  Tooltip as BPTooltip,
} from 'views/components/etc/overlay'

import { PTyp } from '../../../../ptyp'

class ItemTemplate extends PureComponent {
  static propTypes = {
    result: PTyp.shape({
      sat: PTyp.bool.isRequired,
    }).isRequired,
    which: PTyp.EReqWhich.isRequired,
    content: PTyp.node.isRequired,
    tooltip: PTyp.node,
  }

  static defaultProps = {
    tooltip: null,
  }

  render() {
    const {
      result, which,
      tooltip, content,
    } = this.props
    const {sat} = result
    const checkboxClass = sat ?
      (which === 'gs' ? `poi-ship-cond-53 dark` : 'text-success') :
      (which === 'gs' ? 'text-muted' : 'text-danger')
    const itemContent = (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <FontAwesome
          className={checkboxClass}
          style={{
            fontWeight: 'normal',
            marginRight: '.4em',
            width: '1em',
          }}
          name={sat ? 'check-square-o' : 'square-o'}
        />
        <div style={{flex: 1}}>
          {content}
        </div>
      </div>
    )

    return (
      <div
        style={{
          padding: 10,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}>
        {
          tooltip ? (
            <BPTooltip
              position={Position.TOP}
              content={tooltip}>
              {itemContent}
            </BPTooltip>
          ) : (
            itemContent
          )
        }
      </div>
    )
  }
}

export { ItemTemplate }
