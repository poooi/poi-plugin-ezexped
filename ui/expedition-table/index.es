import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap'
import { enumFromTo, modifyObject } from '../../utils'
import { checkExpedReqs } from '../../requirement'
import { PTyp } from '../../ptyp'
import { ExpeditionButton } from './expedition-button'
import {
  fleetIdSelector,
  expedIdSelector,
  fleetInfoSelector,
  expedTableExpandedSelector,
} from '../../selectors'
import { mapDispatchToProps } from '../../store'

class ExpeditionTableImpl extends Component {
  static propTypes = {
    // current active expedition
    expedId: PTyp.number.isRequired,
    fleetId: PTyp.number.isRequired,
    expedTableExpanded: PTyp.bool.isRequired,
    // fleet representation, note that the fleet could be null
    fleet: PTyp.object,
    modifyState: PTyp.func.isRequired,
  }

  static defaultProps = {
    fleet: null,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.expedId !== nextProps.expedId ||
      this.props.expedTableExpanded !== nextProps.expedTableExpanded ||
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
    const {expedTableExpanded} = this.props
    const isReadyArr = new Array(40+1)
    const fleetShips =
      _.isEmpty(this.props.fleet) ? [] : this.props.fleet.ships
    enumFromTo(1,40)
      .map( expedId => {
        isReadyArr[expedId] =
          checkExpedReqs(expedId,false,false)(fleetShips)
      })
    return (
      <Panel
        collapsible
        expanded={expedTableExpanded}
        style={{marginBottom: "5px"}} >
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
        </div>
      </Panel>
    )
  }
}

const ExpeditionTable = connect(
  createStructuredSelector({
    expedId: expedIdSelector,
    fleetId: fleetIdSelector,
    fleet: fleetInfoSelector,
    expedTableExpanded: expedTableExpandedSelector,
  }),
  mapDispatchToProps
)(ExpeditionTableImpl)

export { ExpeditionTable }
