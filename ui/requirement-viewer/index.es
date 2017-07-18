import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ListGroup, ListGroupItem,
} from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'

import { __ } from '../../tr'
import { PTyp } from '../../ptyp'

import { CheckResultBox } from './check-result-box'
import { NewRequirementItem } from './new-requirement-item'

import {
  fleetIdSelector,
  expedIdSelector,
  gsFlagSelector,
  hideSatReqsSelector,
  mkEReqResultObjectSelectorForFleet,
  mkEReqSatFlagsSelectorForFleet,
} from '../../selectors'

// props:
// - fleet: fleet representation
class RequirementViewerImpl extends Component {
  static propTypes = {
    // - target expedition id
    expedId: PTyp.number.isRequired,
    // whether aimming at great success
    greatSuccess: PTyp.bool.isRequired,
    hideSatReqs: PTyp.bool.isRequired,
    ereqResult: PTyp.object.isRequired,
    normFlag: PTyp.bool.isRequired,
    gsFlag: PTyp.bool.isRequired,
    resupplyFlag: PTyp.bool.isRequired,
  }

  static defaultProps = {
    fleet: null,
  }

  genTmpList = () => {
    const {greatSuccess, ereqResult, expedId} = this.props
    const transformObj = which => ({ereq,result},ind) => ({
      ereq,result,which,
      key: `exped-${expedId}-${which}-${ind}`,
    })
    const xs = [
      ...ereqResult.norm.map(transformObj('norm')),
      transformObj('resupply')(ereqResult.resupply,0),
      ...(greatSuccess ? ereqResult.gs : []).map(transformObj('gs')),
    ]
    return xs
  }

  render() {
    const {
      normFlag, gsFlag, resupplyFlag,
      greatSuccess,
      hideSatReqs,
    } = this.props
    const effectiveNormFlag = normFlag && resupplyFlag
    const effectiveGsFlag = effectiveNormFlag && (!greatSuccess || gsFlag)
    const readyOrNot = flg => __(flg ? "CondReady" : "CondNotReady")

    return (
      <div>
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between"}}>
          <CheckResultBox
              ready={effectiveNormFlag} visible={true}
              content={`${__("CondNormal")}: ${readyOrNot(effectiveNormFlag)}`} />
          <CheckResultBox
              ready={effectiveGsFlag} visible={this.props.greatSuccess}
              content={`${__("CondGreatSuccess")}: ${readyOrNot(effectiveGsFlag)}`} />
        </div>
        <ListGroup>
          {
            this.genTmpList().map(({ereq,result,which,key}) => (
              (!result.sat || !hideSatReqs) && (
                <ListGroupItem
                  style={{padding: 10}}
                  key={key}>
                  <NewRequirementItem
                    prefix={`${key}-`}
                    ereq={ereq}
                    result={result}
                    which={which}
                    hideSatReqs={hideSatReqs}
                  />
                </ListGroupItem>
              )
            ))
          }
        </ListGroup>
      </div>
    )
  }
}

const uiExtrasSelector = createStructuredSelector({
  fleetId: fleetIdSelector,
  expedId: expedIdSelector,
  greatSuccess: gsFlagSelector,
  hideSatReqs: hideSatReqsSelector,
})

const RequirementViewer = connect(
  state => {
    const uiExtras = uiExtrasSelector(state)
    const {fleetId} = uiExtras
    const ereqResult =
      mkEReqResultObjectSelectorForFleet(fleetId)(state)
    const ereqSatFlags =
      mkEReqSatFlagsSelectorForFleet(fleetId)(state)
    return {...uiExtras, ereqResult, ...ereqSatFlags}
  },
)(RequirementViewerImpl)

export { RequirementViewer }
