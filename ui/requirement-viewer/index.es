import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ListGroup,
  Grid, Row, Col,
} from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'

import { __ } from '../../tr'
import { PTyp } from '../../ptyp'

import { CheckResultBox } from './check-result-box'
import { EReqListGroupItem } from './ereq-list-group-item'

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

  prepareReqListItems = () => {
    const {greatSuccess, ereqResult, expedId} = this.props
    const transformObj = which => ({ereq,result},ind) => ({
      ereq,result,which,
      key: `exped-${expedId}-${which}-${ind}`,
    })
    const allReqList = [
      ...ereqResult.norm.map(transformObj('norm')),
      transformObj('resupply')(ereqResult.resupply,0),
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
      normFlag, gsFlag, resupplyFlag,
      greatSuccess,
    } = this.props
    const effectiveNormFlag = normFlag && resupplyFlag
    const effectiveGsFlag = effectiveNormFlag && (!greatSuccess || gsFlag)
    const readyOrNot = flg => __(flg ? "CondReady" : "CondNotReady")

    return (
      <div>
        <Grid style={{width: '100%'}}>
          <Row>
            <Col sm={6} style={{paddingRight: '.5em'}}>
              <CheckResultBox
                ready={effectiveNormFlag}
                content={`${__("CondNormal")}: ${readyOrNot(effectiveNormFlag)}`} />
            </Col>
            <Col sm={6} style={{paddingLeft: '.5em'}}>
              {
                this.props.greatSuccess && (
                  <CheckResultBox
                    ready={effectiveGsFlag}
                    content={`${__("CondGreatSuccess")}: ${readyOrNot(effectiveGsFlag)}`}
                  />
                )
              }
            </Col>
          </Row>
        </Grid>
        <ListGroup>
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
