import React, { PureComponent } from 'react'
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
      <div
        style={{
          ...this.props.style,
          paddingLeft: '.2em',
          display: 'flex',
          alignItems: 'center',
        }}>
        <div
          style={{
            minWidth: 18, minHeight: 18,
            textAlign: 'center',
          }}
        >
          {this.props.icon}
        </div>
        <div
          style={{
            flex: 1,
            marginLeft: '.4em',
            textAlign: 'center',
          }}
        >
          {this.props.label}
        </div>
      </div>
    )
  }
}

export { IconAndLabel }
