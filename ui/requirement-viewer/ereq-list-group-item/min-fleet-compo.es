import _ from 'lodash'
import React, { Component } from 'react'

import { PTyp } from '../../../ptyp'
import { shortDesc as esShortDesc } from '../../../estype'

// in case we need to compute a key rather than using Array index
const computeKey = _.memoize(stypeInfoList =>
  stypeInfoList.map(({estype,need}) => `${need}${estype}`).join('-'))

class MinFleetCompo extends Component {
  static propTypes = {
    stypeInfoList: PTyp.array.isRequired,
    style: PTyp.object,
    // CSS margin between elements
    between: PTyp.string,
    noDanger: PTyp.bool,
  }

  static defaultProps = {
    style: {},
    between: '.2em',
    noDanger: false,
  }

  render() {
    const {
      stypeInfoList, style, between, noDanger,
    } = this.props
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          ...style,
        }}>
        {
          stypeInfoList.map(({estype, need, sat},ind) => {
            const isLast = ind+1 === stypeInfoList.length
            return (
              <div
                className={
                  sat ? 'text-success' :
                  (noDanger ? '' : 'text-danger')
                }
                style={{
                  marginLeft: 0,
                  marginRight: isLast ? 0 : between,
                }}
                key={estype}>
                {`${need}${esShortDesc(estype)}`}
              </div>
            )
          })
        }
      </div>
    )
  }
}

export {
  MinFleetCompo,
  computeKey,
}
