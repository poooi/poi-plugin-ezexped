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

/*

  In-game UI displays worlds in the following order:
  W1 W2 W3 W7 W4 W5 W6.

  This function returns a zero-based index for each world indicating
  where it should be placed in the ui (therefore a "visual" index),
  so that those worlds appear in the order specified above.

 */
const visualWorldIndex = worldId => {
  if (worldId === 7)
    return 3
  if (worldId <= 3 || worldId >= 8)
    return worldId - 1
  return worldId
}

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
              ([worldId, expedIds], _worldInd) =>
                expedIds.map((expedId, expedInd) => {
                  const normGsFlag = normGsFlags[expedId] || normGsFlags.missing
                  const row = expedInd + 1
                  const col = visualWorldIndex(worldId) + 1
                  return (
                    <ExpeditionButton
                      gridRow={row}
                      gridCol={col}
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
