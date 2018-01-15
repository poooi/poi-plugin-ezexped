import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap'
import { modifyObject } from 'subtender'
import { PTyp } from '../../ptyp'
import { ExpeditionButton } from './expedition-button'
import {
  fleetIdSelector,
  expedIdSelector,
  expedTableExpandedSelector,
  darkOrLightSelector,
  getExpedInfoFuncSelector,
  grouppedExpedIdsSelector,
} from '../../selectors'
import {
  mkEReqNormGsFlagsSelectorForFleet,
  currentRunningExpedIdToFleetIdSelector,
} from './selectors'
import { mapDispatchToProps } from '../../store'
import { KanceptsExporter } from './kancepts-exporter'

class ExpeditionTableImpl extends Component {
  static propTypes = {
    darkOrLight: PTyp.DarkOrLight.isRequired,
    // current active expedition
    expedId: PTyp.number.isRequired,
    fleetId: PTyp.number.isRequired,
    expedTableExpanded: PTyp.bool.isRequired,
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
      expedTableExpanded,
      normGsFlags,
      currentRunningExpedIdToFleetId,
      darkOrLight,
      getExpedInfo,
      grouppedExpedIds,
    } = this.props

    const expedIdsArr = grouppedExpedIds.filter(
      // only show expeditions from world 1 to 5
      ([w,_v]) => w >= 1 && w <= 5
    )

    return (
      <Panel
        className="exped-btn-table"
        collapsible
        expanded={expedTableExpanded}
        style={{marginBottom: "5px"}} >
        <Panel.Collapse>
          <Panel.Body>
            <div style={{display: "flex"}} >
              {
                expedIdsArr.map(([world, expedIds]) => (
                  <div
                    key={world}
                    style={{
                      flex: 1,
                      display: 'flex',
                      marginRight: 5,
                      flexDirection: 'column',
                    }}>
                    {
                      expedIds.map(expedId => {
                        const normGsFlag = normGsFlags[expedId] || normGsFlags.missing
                        return (
                          <ExpeditionButton
                            key={expedId}
                            ready={normGsFlag.norm}
                            btnClassName={
                              (
                                normGsFlag.norm &&
                                normGsFlag.gs
                              ) ? `poi-ship-cond-53 ${darkOrLight}` : ''
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
                    }
                  </div>
                )
                )
              }
            </div>
            <KanceptsExporter style={{}} />
          </Panel.Body>
        </Panel.Collapse>
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
  getExpedInfo: getExpedInfoFuncSelector,
  grouppedExpedIds: grouppedExpedIdsSelector,
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
