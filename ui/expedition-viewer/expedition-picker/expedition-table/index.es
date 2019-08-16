import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { modifyObject } from 'subtender'
import { PTyp } from '../../../../ptyp'
import { ExpeditionButton } from './expedition-button'
import {
  fleetIdSelector,
  expedIdSelector,
  getExpedInfoFuncSelector,
  grouppedExpedIdsSelector,
} from '../../../../selectors'
import {
  mkEReqNormGsFlagsSelectorForFleet,
  currentRunningExpedIdToFleetIdSelector,
} from './selectors'
import { mapDispatchToProps } from '../../../../store'
import { KanceptsExporter } from './kancepts-exporter'

const uiSelector = createStructuredSelector({
  expedId: expedIdSelector,
  fleetId: fleetIdSelector,
  currentRunningExpedIdToFleetId: currentRunningExpedIdToFleetIdSelector,
  getExpedInfo: getExpedInfoFuncSelector,
  grouppedExpedIds: grouppedExpedIdsSelector,
})

@connect(
  state => {
    const ui = uiSelector(state)
    const {fleetId} = ui
    const normGsFlags = mkEReqNormGsFlagsSelectorForFleet(fleetId)(state)
    return {...ui, normGsFlags}
  },
  mapDispatchToProps
)
class ExpeditionTable extends Component {
  static propTypes = {
    style: PTyp.object.isRequired,
    // connected
    // current active expedition
    expedId: PTyp.number.isRequired,
    fleetId: PTyp.number.isRequired,
    getExpedInfo: PTyp.func.isRequired,
    modifyState: PTyp.func.isRequired,
    normGsFlags: PTyp.objectOf(PTyp.shape({
      norm: PTyp.bool.isRequired,
      gs: PTyp.bool.isRequired,
    })).isRequired,
    currentRunningExpedIdToFleetId: PTyp.objectOf(PTyp.number).isRequired,
    grouppedExpedIds: PTyp.array.isRequired,
  }

  handleSelectExped = newExpedId => () => {
    const {fleetId} = this.props
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
      normGsFlags,
      currentRunningExpedIdToFleetId,
      getExpedInfo,
      grouppedExpedIds,
      style,
    } = this.props

    const expedIdsArr = grouppedExpedIds.filter(
      // only show expeditions from world 1 to 7
      ([w,_v]) => w >= 1 && w <= 7
    )

    const worldCount = expedIdsArr.length
    return (
      <div
        style={{
          padding: 10,
          ...style,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridGap: '2px 5px',
            gridTemplate: `auto / repeat(${worldCount}, 1fr)`,
            alignItems: 'center',
          }}
        >
          {
            _.flatMap(
              expedIdsArr,
              ([_world, expedIds], worldInd) =>
                expedIds.map((expedId, expedInd) => {
                  const normGsFlag = normGsFlags[expedId] || normGsFlags.missing
                  return (
                    <ExpeditionButton
                      style={{gridArea: `${expedInd+1} / ${worldInd+1}`}}
                      key={expedId}
                      ready={normGsFlag.norm}
                      btnClassName={
                        (
                          normGsFlag.norm &&
                          normGsFlag.gs
                        ) ? `poi-ship-cond-53 dark` : ''
                      }
                      active={this.props.expedId === expedId}
                      runningFleetId={
                        currentRunningExpedIdToFleetId[expedId]
                      }
                      expedId={expedId}
                      getExpedInfo={getExpedInfo}
                      onClick={this.handleSelectExped(expedId)}
                    />
                  )
                })
            )
          }
        </div>
        <KanceptsExporter style={{marginTop: '.6em'}} />
      </div>
    )
  }
}

export { ExpeditionTable }
