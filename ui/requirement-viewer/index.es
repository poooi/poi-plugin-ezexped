import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { __ } from '../../tr'
import { PTyp } from '../../ptyp'

import { CheckResultBox } from './check-result-box'
import { EReqListGroupItem } from './ereq-list-group-item'

import {
  fleetIdSelector,
  expedIdSelector,
  gsFlagSelector,
  dlcFlagSelector,
  hideSatReqsSelector,
  mkEReqResultObjectSelectorForFleet,
  mkEReqSatFlagsSelectorForFleet,
} from '../../selectors'

// props:
// - fleet: fleet representation

const uiExtrasSelector = createStructuredSelector({
  fleetId: fleetIdSelector,
  expedId: expedIdSelector,
  greatSuccess: gsFlagSelector,
  fillDlc: dlcFlagSelector,
  hideSatReqs: hideSatReqsSelector,
})

@connect(
  state => {
    const uiExtras = uiExtrasSelector(state)
    const {fleetId} = uiExtras
    const ereqResult =
      mkEReqResultObjectSelectorForFleet(fleetId)(state)
    const ereqSatFlags =
      mkEReqSatFlagsSelectorForFleet(fleetId)(state)
    return {...uiExtras, ereqResult, ...ereqSatFlags}
  },
)
class RequirementViewer extends Component {
  static propTypes = {
    // connected
    // - target expedition id
    expedId: PTyp.number.isRequired,
    // whether aimming at great success
    greatSuccess: PTyp.bool.isRequired,
    fillDlc: PTyp.bool.isRequired,
    hideSatReqs: PTyp.bool.isRequired,
    ereqResult: PTyp.object.isRequired,
    normFlag: PTyp.bool.isRequired,
    gsFlag: PTyp.bool.isRequired,
    dlcFlag: PTyp.bool.isRequired,
    resupplyFlag: PTyp.bool.isRequired,
  }

  prepareReqListItems = () => {
    const {greatSuccess, ereqResult, expedId, fillDlc} = this.props
    const transformObj = which => ({ereq,result},ind) => ({
      ereq,result,which,
      key: `exped-${expedId}-${which}-${ind}`,
    })
    const allReqList = [
      ...ereqResult.norm.map(transformObj('norm')),
      transformObj('resupply')(ereqResult.resupply,0),
      ...(fillDlc ? [transformObj('dlc')(ereqResult.dlc,0)] : []),
      ...(greatSuccess ? ereqResult.gs.map(transformObj('gs')) : []),
    ]
    const {hideSatReqs} = this.props
    const filteredReqList = hideSatReqs ?
      allReqList.filter(obj => !obj.result.sat) :
      allReqList

    return filteredReqList
  }

  render() {
    const {
      normFlag, gsFlag, resupplyFlag, dlcFlag,
      fillDlc,
      greatSuccess,
    } = this.props
    const effectiveDlcFlag = !fillDlc || (fillDlc && dlcFlag)
    const effectiveNormFlag = normFlag && resupplyFlag && effectiveDlcFlag
    const effectiveGsFlag = effectiveNormFlag && (!greatSuccess || gsFlag)
    const readyOrNot = flg => __(flg ? "CondReady" : "CondNotReady")

    return (
      <div
        style={{
          flex: 1, height: 0,
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplate: 'auto / 1fr 1fr',
            gridGap: '0 .4em',
            alignItems: 'center',
          }}
        >
          <CheckResultBox
            ready={effectiveNormFlag}
            content={`${__("CondNormal")}: ${readyOrNot(effectiveNormFlag)}`} />
          {
            this.props.greatSuccess && (
              <CheckResultBox
                ready={effectiveGsFlag}
                content={`${__("CondGreatSuccess")}: ${readyOrNot(effectiveGsFlag)}`}
              />
            )
          }
        </div>
        <div
          style={{
            marginBottom: 20,
            paddingLeft: 0,
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {
            this.prepareReqListItems().map(({key, ereq, result, which}) => (
              <EReqListGroupItem
                key={key}
                prefix={`ezexped-${key}-`}
                ereq={ereq}
                result={result}
                which={which}
              />
            ))
          }
        </div>
      </div>
    )
  }
}

export { RequirementViewer }
