import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap'
import { enumFromTo, modifyObject } from 'subtender'
import { PTyp } from '../../ptyp'
import { ExpeditionButton } from './expedition-button'
import {
  fleetIdSelector,
  expedIdSelector,
  expedTableExpandedSelector,
  darkOrLightSelector,
} from '../../selectors'
import {
  mkEReqNormGsFlagsSelectorForFleet,
  currentRunningExpedIdToFleetIdSelector,
} from './selectors'
import { mapDispatchToProps } from '../../store'
import { KanceptsExporter } from './kancepts-exporter'

const allExpedIds = enumFromTo(1,40)

class ExpeditionTableImpl extends Component {
  static propTypes = {
    darkOrLight: PTyp.DarkOrLight.isRequired,
    // current active expedition
    expedId: PTyp.number.isRequired,
    fleetId: PTyp.number.isRequired,
    expedTableExpanded: PTyp.bool.isRequired,
    modifyState: PTyp.func.isRequired,
    normGsFlags: PTyp.objectOf(PTyp.shape({
      norm: PTyp.bool.isRequired,
      gs: PTyp.bool.isRequired,
    })).isRequired,
    currentRunningExpedIdToFleetId: PTyp.objectOf(PTyp.number).isRequired,
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
    const {
      expedTableExpanded,
      normGsFlags,
      currentRunningExpedIdToFleetId,
      darkOrLight,
    } = this.props
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
              _.chunk(allExpedIds,8)
            ).map(([world, expedIds]) =>
              (
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
                          ready={normGsFlags[expedId].norm}
                          btnClassName={
                            (
                              normGsFlags[expedId].norm &&
                              normGsFlags[expedId].gs
                            ) ? `poi-ship-cond-53 ${darkOrLight}` : ''
                          }
                          active={this.props.expedId === expedId}
                          runningFleetId={
                            currentRunningExpedIdToFleetId[expedId]
                          }
                          expedId={expedId}
                          onClick={this.handleSelectExped(expedId)}
                        />
                      )
                    )
                  }
                </div>
              )
            )
          }
        </div>
        <KanceptsExporter style={{}} />
      </Panel>
    )
  }
}

const uiSelector = createStructuredSelector({
  expedId: expedIdSelector,
  fleetId: fleetIdSelector,
  expedTableExpanded: expedTableExpandedSelector,
  currentRunningExpedIdToFleetId: currentRunningExpedIdToFleetIdSelector,
  darkOrLight: darkOrLightSelector,
})

const ExpeditionTable = connect(
  state => {
    const ui = uiSelector(state)
    const {fleetId} = ui
    const normGsFlags = mkEReqNormGsFlagsSelectorForFleet(fleetId)(state)
    return {...ui, normGsFlags}
  },
  mapDispatchToProps
)(ExpeditionTableImpl)

export { ExpeditionTable }
