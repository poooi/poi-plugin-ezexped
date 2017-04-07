import React, { Component } from 'react'

const { _, FontAwesome } = window

import {
  Button,
  ListGroup, ListGroupItem,
  OverlayTrigger, Tooltip,
} from 'react-bootstrap'

import { 
  checkExpedDetail,
  collapseResults,
  isEqualReqObj,
} from './requirement'

import * as estype from './estype'
import { __ } from './tr'

import { error } from './utils'

// a box for showing whether the fleet is ready
// props:
// - content
// - ready: bool
// - visible: bool
class CheckResultBox extends Component {
  render() {
    return (
      <Button bsStyle={this.props.ready ? "success" : "danger"}
              disabled={true}
              style={{
                width: "48%",
                opacity: "1", margin: "10px 0 10px 0", 
                borderRadius: "10px", display: "flex",
                visibility: this.props.visible ? "visible" : "hidden"}}>
        <FontAwesome
            style={{marginRight: "5px", marginTop: "2px"}}
            name={this.props.ready ? "check-square-o" : "square-o"} />
        <div style={{
          overflow: "hidden",
          textOverflow: "ellipsis"}}>
          {this.props.content}</div>
      </Button>
    )}}

const renderRequirement = (req,ok) => {
  if (Array.isArray(req)) {
    const tooltip = (<Tooltip id="eq-stc-req-tooltip" className="ezexped-pop">
      <div style={{display: "flex", flexDirection: "column"}}>
        {req.map( ({data},ind) =>
          <div key={ind} style={{flex: "1", display: "flex"}}>
            <FontAwesome
              style={{marginRight: "5px", marginTop: "2px"}}
              name={ok[ind] ? "check-square-o" : "square-o"} />
            <div style={{flex:"1", whiteSpace: "nowrap"}}>
              {`${estype.longDesc(__)(data.estype)} x ${data.count}`}
            </div>
          </div>)}
      </div>
    </Tooltip>)

    // every object in this array should be of type "ShipTypeCount"
    return (
      <OverlayTrigger
        placement="bottom" overlay={tooltip}>
      <div style={{display: "flex"}}>
        <div key="header">{__("Fleet Composition")}:</div>
        {req.map( ({data: {count, estype: estypeName}}, ind) => 
          <div 
              style={{marginLeft:"5px", color: ok[ind] ? "green" : "red" }}
              key={`ce-${ind}`} >
            {`${count}${estype.shortDesc(estypeName)}`}
          </div> )}
      </div>
    </OverlayTrigger>)
  }

  const fmt = function () {
    return __(`RequirementExplain.${req.data.type}`, ...arguments)
  }

  if (req.data.type === "FSType") {
    return fmt(estype.longDesc(__)(req.data.estype))
  }

  if (req.data.type === "FSLevel") {
    return fmt(req.data.level)
  }

  if (req.data.type === "ShipCount") {
    return fmt(req.data.count)
  }

  if (req.data.type === "DrumCarrierCount") {
    return fmt(req.data.count)
  }

  if (req.data.type === "DrumCount") {
    return fmt(req.data.count)
  }

  if (req.data.type === "LevelSum") {
    return fmt(req.data.sum)
  }

  if (req.data.type === "SparkledCount") {
    return fmt(req.data.count)
  }

  if (req.data.type === "RecommendSparkledCount") {
    return fmt(req.data.count)
  }

  if (req.data.type === "Morale") {
    return fmt(req.data.morale)
  }

  if (req.data.type === "Resupply") {
    return fmt()
  }

  return error("Unhandled Req type: ${req.data.type}")
}

// props:
// - req: either an Req object of non ShipTypeCount, or an array of ShipTypeCount Req objects
// - ok:  a boolean or an array of boolean (for ShipTypeCount array)
// - greatSuccess: whether this is required by GS
class RequirementListItem extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.ok !== nextProps.ok ||
      this.props.greatSuccess !== nextProps.greatSuccess ||
      ! isEqualReqObj(this.props.req, nextProps.req)
  }

  render() {
    const allOk = collapseResults( this.props.ok )
    const checkBoxColor = allOk
      ? (this.props.greatSuccess 
          ? "gold" : "green") 
      : (this.props.greatSuccess
          ? "grey" : "red")
    return (
      <ListGroupItem 
          style={{padding: "10px", display: "flex"}}>
        <FontAwesome
            style={{marginRight: "5px", marginTop: "2px", color: checkBoxColor }}
            name={allOk ? "check-square-o" : "square-o"} />
        { renderRequirement(this.props.req, this.props.ok) }
      </ListGroupItem>)}}

// props:
// - fleet: fleet representation
// - expedId: target expedition id
// - greatSuccess: whether aimming at great success
// - recommendedSparkled
class RequirementViewer extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.expedId !== nextProps.expedId ||
      this.props.greatSuccess !== nextProps.greatSuccess ||
      this.props.recommendedSparkled !== nextProps.recommendedSparkled ||
      ! _.isEqual(this.props.fleet, nextProps.fleet)
  }

  render() {
    const resultDetail =
      checkExpedDetail(
        this.props.expedId,true,true,
        this.props.recommendedSparkled)(this.props.fleet.ships)
    const normCheckResult = collapseResults( resultDetail.norm.map( ([req,res]) => res) )
    const resupplyCheckResult = resultDetail.resupply[1]
    const gsCheckResult = collapseResults( resultDetail.gs.map( ([req,res]) => res ) )

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
          { resultDetail.norm.map( ([req,res],ind) =>
              <RequirementListItem
                  key={`norm-${ind}`}
                  req={req}
                  ok={res}
                  greatSuccess={false} />)}
          <RequirementListItem
              key="resupply"
              req={resultDetail.resupply[0]}
              ok={resultDetail.resupply[1]}
              greatSuccess={false} />
          { this.props.greatSuccess &&
            resultDetail.gs.map( ([req,res],ind) =>
              <RequirementListItem
                  key={`gs-${ind}`}
                  req={req}
                  ok={res}
                  greatSuccess={true}
              />) }

        </ListGroup>
      </div>
    )
  }
}

export { RequirementViewer }
