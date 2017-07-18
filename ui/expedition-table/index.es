import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap'
import { enumFromTo, modifyObject } from '../../utils'
import { PTyp } from '../../ptyp'
import { ExpeditionButton } from './expedition-button'
import {
  fleetIdSelector,
  expedIdSelector,
  expedTableExpandedSelector,
} from '../../selectors'
import {
  mkEReqNormFlagsSelectorForFleet,
} from './selectors'
import { mapDispatchToProps } from '../../store'

const allExpedIds = enumFromTo(1,40)

class ExpeditionTableImpl extends Component {
  static propTypes = {
    // current active expedition
    expedId: PTyp.number.isRequired,
    fleetId: PTyp.number.isRequired,
    expedTableExpanded: PTyp.bool.isRequired,
    modifyState: PTyp.func.isRequired,
    normFlags: PTyp.objectOf(PTyp.bool).isRequired,
  }

  static defaultProps = {
    fleet: null,
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
    const {expedTableExpanded, normFlags} = this.props
    return (
      <Panel
        collapsible
        expanded={expedTableExpanded}
        style={{marginBottom: "5px"}} >
        <div style={{display: "flex"}} >
          {
            _.zip(
              // worlds
              enumFromTo(1,5),
              // expedition ids in that world
              _.chunk(allExpedIds,8))
             .map(([world, expedIds]) => (
               <div
                 key={world}
                 style={{
                   flex: 1,
                   display: 'flex',
                   marginRight: 5,
                   flexDirection: 'column',
                 }}>
                 {
                   expedIds.map(expedId =>
                     (
                       <ExpeditionButton
                         key={expedId}
                         ready={normFlags[expedId]}
                         active={this.props.expedId === expedId}
                         expedId={expedId}
                         onClick={this.handleSelectExped(expedId)}
                       />
                     )
                   )
                }
               </div>
             ))
          }
        </div>
      </Panel>
    )
  }
}

const uiSelector = createStructuredSelector({
  expedId: expedIdSelector,
  fleetId: fleetIdSelector,
  expedTableExpanded: expedTableExpandedSelector,
})

const ExpeditionTable = connect(
  state => {
    const ui = uiSelector(state)
    const {fleetId} = ui
    const normFlags = mkEReqNormFlagsSelectorForFleet(fleetId)(state)
    return {...ui, normFlags}
  },
  mapDispatchToProps
)(ExpeditionTableImpl)

export { ExpeditionTable }
