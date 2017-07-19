import React, { Component } from 'react'

import { PTyp } from '../../../ptyp'
import { shortDesc as esShortDesc } from '../../../estype'

// in case we need to compute a key rather than using Array index
const computeKey = stypeInfoList => stypeInfoList.map(({estype,need}) =>
  `${need}${estype}`).join('-')

class MinFleetCompo extends Component {
  static propTypes = {
    stypeInfoList: PTyp.array.isRequired,
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    const {stypeInfoList, style} = this.props
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}>
        {
          stypeInfoList.map(({estype, need, sat}) => (
            <div
              style={{
                marginLeft: '.2em',
                color: sat ? 'green' : 'red',
              }}
              key={estype}>
              {`${need}${esShortDesc(estype)}`}
            </div>
          ))
        }
      </div>
    )
  }
}

export {
  MinFleetCompo,
  computeKey,
}
