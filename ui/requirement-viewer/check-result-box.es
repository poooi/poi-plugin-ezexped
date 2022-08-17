import FontAwesome from 'react-fontawesome'
import React, { PureComponent } from 'react'
import {
  Tag,
  Classes,
} from '@blueprintjs/core'
import styled from 'styled-components'
import { PTyp } from '../../ptyp'

const CTag = styled(Tag)`
  & > span.${Classes.TEXT_OVERFLOW_ELLIPSIS} {
    display: flex;
    align-items: center;
    width: 100%;
    border-radius: 10px,
  }
`

// a box for showing whether the fleet is ready
class CheckResultBox extends PureComponent {
  static propTypes = {
    ready: PTyp.bool.isRequired,
    content: PTyp.node.isRequired,
  }

  render() {
    const {ready, content} = this.props
    return (
      <CTag
        intent={ready ? 'success' : 'danger'}
        style={{
          padding: '.7em',
          margin: '10px 0',
          fontSize: '100%',
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
      </CTag>
    )
  }
}

export {
  CheckResultBox,
}
