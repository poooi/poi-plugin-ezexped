import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { enumFromTo, modifyObject } from '../../utils'
import { checkExpedReqs } from '../../requirement'
import { PTyp } from '../../ptyp'
import { ExpeditionButton } from './expedition-button'
import {
  fleetIdSelector,
  expedIdSelector,
  fleetInfoSelector,
} from '../../selectors'
import { mapDispatchToProps } from '../../store'

class ExpeditionTableImpl extends Component {
  static propTypes = {
    // current active expedition
    expedId: PTyp.number.isRequired,
    fleetId: PTyp.number.isRequired,
    // fleet representation
    fleet: PTyp.object.isRequired,
    modifyState: PTyp.func.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.expedId !== nextProps.expedId ||
      ! _.isEqual(this.props.fleet,nextProps.fleet)
  }

  handleSelectExped = newExpedId => () => {
    const fleetId = this.props.fleetId
    this.props.modifyState(
      _.flow(
        modifyObject(
          'expedTableExpanded',
          () => false),
        modifyObject(
          'selectedExpeds',
          modifyObject(fleetId, () => newExpedId))))
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
                      onClick={this.handleSelectExped(expedId)}
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

const ExpeditionTable = connect(
  createStructuredSelector({
    expedId: expedIdSelector,
    fleetId: fleetIdSelector,
    fleet: fleetInfoSelector,
  }),
  mapDispatchToProps
)(ExpeditionTableImpl)

export { ExpeditionTable }
