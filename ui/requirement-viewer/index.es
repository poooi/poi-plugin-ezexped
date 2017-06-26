import { _ } from 'lodash'
import React, { Component, PropTypes } from 'react'
import {
  ListGroup,
} from 'react-bootstrap'

import {
  checkExpedDetail,
  collapseResults,
} from '../../requirement'

import { __ } from '../../tr'

import { CheckResultBox } from './check-result-box'
import { RequirementListItem } from './requirement-list-item'

// props:
// - fleet: fleet representation
class RequirementViewer extends Component {
  static propTypes = {
    // - target expedition id
    expedId: PropTypes.number.isRequired,
    // whether aimming at great success
    greatSuccess: PropTypes.bool.isRequired,
    hideSatReqs: PropTypes.bool.isRequired,
    recommendSparkled: PropTypes.number.isRequired,
    fleet: PropTypes.object.isRequired,
  }
  shouldComponentUpdate(nextProps) {
    return this.props.expedId !== nextProps.expedId ||
      this.props.greatSuccess !== nextProps.greatSuccess ||
      this.props.recommendSparkled !== nextProps.recommendSparkled ||
      this.props.hideSatReqs !== nextProps.hideSatReqs ||
      ! _.isEqual(this.props.fleet, nextProps.fleet)
  }

  render() {
    const resultDetail =
      checkExpedDetail(
        this.props.expedId,true,true,
        this.props.recommendSparkled)(this.props.fleet.ships)
    const normCheckResult = collapseResults( resultDetail.norm.map( ([_req,res]) => res) )
    const resupplyCheckResult = resultDetail.resupply[1]
    const gsCheckResult = collapseResults( resultDetail.gs.map( ([_req,res]) => res ) )

    const normFlg = normCheckResult && resupplyCheckResult
    const gsFlg = normFlg && gsCheckResult
    const readyOrNot = flg => __(flg ? "CondReady" : "CondNotReady")
    return (
      <div>
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between"}}>
          <CheckResultBox
              ready={normFlg} visible={true}
              content={`${__("CondNormal")}: ${readyOrNot(normCheckResult)}`} />
          <CheckResultBox
              ready={gsFlg} visible={this.props.greatSuccess}
              content={`${__("CondGreatSuccess")}: ${readyOrNot(gsCheckResult)}`} />
        </div>
        <ListGroup>
          {
            resultDetail.norm.map( ([req,res],ind) => (
              <RequirementListItem
                key={`norm-${ind}`}
                hideSatReqs={this.props.hideSatReqs}
                req={req}
                ok={res}
                greatSuccess={false} />
            )
            )
          }
          <RequirementListItem
              key="resupply"
              hideSatReqs={this.props.hideSatReqs}
              req={resultDetail.resupply[0]}
              ok={resultDetail.resupply[1]}
              greatSuccess={false} />
          {

            this.props.greatSuccess &&
            resultDetail.gs.map( ([req,res],ind) => (
              <RequirementListItem
                key={`gs-${ind}`}
                hideSatReqs={this.props.hideSatReqs}
                req={req}
                ok={res}
                greatSuccess={true}
              />
            ))
          }
        </ListGroup>
      </div>
    )
  }
}

export { RequirementViewer }
