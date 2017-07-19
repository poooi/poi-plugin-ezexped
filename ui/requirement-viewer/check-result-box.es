import FontAwesome from 'react-fontawesome'
import React, { PureComponent } from 'react'
import {
  Label,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

// a box for showing whether the fleet is ready
class CheckResultBox extends PureComponent {
  static propTypes = {
    ready: PTyp.bool.isRequired,
    content: PTyp.node.isRequired,
  }

  render() {
    const {ready, content} = this.props
    return (
      <Label
        bsStyle={ready ? 'success' : 'danger'}
        disabled={true}
        style={{
          fontSize: '100%',
          padding: '.7em',
          margin: '10px 0',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
        }}>
        <FontAwesome
          name={ready ? 'check-square-o' : 'square-o'}
        />
        <div style={{
          marginLeft: '.4em',
          textAlign: 'left',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis'}}>
          {content}
        </div>
      </Label>
    )
  }
}

export {
  CheckResultBox,
}
