import FontAwesome from 'react-fontawesome'
import { _ } from 'lodash'
import React, { PureComponent } from 'react'
import {
  Button,
} from 'react-bootstrap'

import { __ } from '../../tr'
import { PTyp } from '../../ptyp'

// a box for showing whether the fleet is ready
// props:
// - content
// - ready: bool
// - visible: bool
class CheckResultBox extends PureComponent {
  static propTypes = {
    ready: PTyp.bool.isRequired,
    visible: PTyp.bool.isRequired,
    content: PTyp.node.isRequired,
  }
  render() {
    const {ready, visible, content} = this.props
    return (
      <Button
        bsStyle={ready ? "success" : "danger"}
        disabled={true}
        style={{
          width: "48%",
          opacity: "1", margin: "10px 0 10px 0",
          borderRadius: "10px", display: "flex",
          visibility: visible ? "visible" : "hidden"}}>
        <FontAwesome
          style={{marginRight: "5px", marginTop: "2px"}}
          name={ready ? "check-square-o" : "square-o"} />
        <div style={{
          overflow: "hidden",
          textOverflow: "ellipsis"}}>
          {content}
        </div>
      </Button>
    )
  }
}

export {
  CheckResultBox,
}
