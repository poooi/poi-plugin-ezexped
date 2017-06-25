import { _ } from 'lodash'
import React, { Component } from 'react'

import { enumFromTo } from '../utils'
import { checkExpedReqs } from '../requirement'
import { PTyp } from '../ptyp'
import { ExpeditionButton } from './expedition-button'

// props:
// - expedId: current active expedition
// - onSelectExped: when one expedition is selected
// - fleet: fleet representation
class ExpeditionTable extends Component {
  static propTypes = {
    expedId: PTyp.number.isRequired,
    fleet: PTyp.object.isRequired,
    onSelectExped: PTyp.func.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.expedId !== nextProps.expedId ||
      ! _.isEqual(this.props.fleet,nextProps.fleet)
  }

  render() {
    const isReadyArr = new Array(40+1)
    enumFromTo(1,40)
      .map( expedId => {
        isReadyArr[expedId] =
          checkExpedReqs(expedId,false,false)(this.props.fleet.ships)
      })
    return (
      <div style={{display: "flex"}} >
        {
          enumFromTo(1,5).map(world => (
            <div key={world}
                 style={{flex: "1", display: "flex", marginRight: "5px", flexDirection: "column"}}>
              {
                enumFromTo(1+8*(world-1), 8*world).map(expedId =>
                  (
                    <ExpeditionButton
                      key={expedId}
                      ready={isReadyArr[expedId]}
                      active={this.props.expedId === expedId}
                      expedId={expedId}
                      onSelectExped={this.props.onSelectExped}
                    />
                  )
                )
            }
            </div>)
          )
        }
      </div>)
  }
}

export { ExpeditionTable }
