import React, { PureComponent } from 'react'

import { __ } from '../../tr'
import { PTyp } from '../../ptyp'

class IconAndLabel extends PureComponent {
  static propTypes = {
    style: PTyp.object,
    icon: PTyp.node.isRequired,
    label: PTyp.node.isRequired,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    return (
      <div style={{...this.props.style, paddingLeft: "6px", display: "flex"}}>
        <div>{this.props.icon}</div>
        <div style={{flex: "1", marginLeft: "2px", marginRight: "2px"}} >{this.props.label}</div>
      </div>
    )
  }
}

export { IconAndLabel }
