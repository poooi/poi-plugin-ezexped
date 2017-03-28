import React, { Component } from 'react'

const { _, FontAwesome } = window

import {
  Button,
  ListGroup, ListGroupItem,
  OverlayTrigger, Tooltip,
} from 'react-bootstrap'

import { 
  expedReqs, 
  expedGSReqs, 
  checkAllReq, 
  collapseResults,
} from './requirement'

import * as estype from './estype'

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
                flex: "1", opacity: "1", margin: "10px 20px 10px 20px", 
                borderRadius: "10px", display: "flex",
                visibility: this.props.visible ? "visible" : "hidden"}}>
        <FontAwesome
            style={{marginRight: "5px", marginTop: "2px"}}
            name={this.props.ready ? "check-square-o" : "square-o"} />
        <div>{this.props.content}</div>
      </Button>
    )}}

// TODO: use tooltip for showing ShipTypeCount rendering in detail

const renderRequirement = (req,ok) => {
  if (Array.isArray(req)) {
    const tooltip = (<Tooltip className="ezexped-pop">
      <div style={{display: "flex", flexDirection: "column"}}>
        {req.map( ({data},ind) =>
          <div key={ind} style={{flex: "1", display: "flex"}}>
            <FontAwesome
              style={{marginRight: "5px", marginTop: "2px"}}
              name={ok[ind] ? "check-square-o" : "square-o"} />
            <div style={{flex:"1", whiteSpace: "nowrap"}}>
              {`${estype.longDesc(data.estype)} x ${data.count}`}
            </div>
          </div>)}
      </div>
    </Tooltip>)

    // every object in this array should be of type "ShipTypeCount"
    return (
      <OverlayTrigger
        placement="bottom" overlay={tooltip}>
      <div style={{display: "flex"}}>
        <div key="header">Fleet Composition:</div>
        {req.map( ({data: {count, estype: estypeName}}, ind) => 
          <div 
              style={{marginLeft:"5px", color: ok[ind] ? "green" : "red" }}
              key={`ce-${ind}`} >
            {`${count}${estype.shortDesc(estypeName)}`}
          </div> )}
      </div>
    </OverlayTrigger>)
  }

  if (req.data.type === "FSType") {
    return `Flagship type: ${estype.longDesc(req.data.estype)}`
  }

  if (req.data.type === "FSLevel") {
    return `Flagship level ≥${req.data.level}`
  }

  if (req.data.type === "ShipCount") {
    return `Fleet contains ≥${req.data.count} ship(s)`
  }

  if (req.data.type === "DrumCarrierCount") {
    return `≥${req.data.count} ship(s) should carry \"ドラム缶(輸送用)\"`
  }

  if (req.data.type === "DrumCount") {
    return `Fleet carries ≥${req.data.count} \"ドラム缶(輸送用)\" in total`
  }

  if (req.data.type === "LevelSum") {
    return `Total level of this fleet should be at least ${req.data.sum}`
  }

  if (req.data.type === "SparkledCount") {
    return `≥${req.data.count} sparkled ship(s) for a great success rate boost`
  }

  if (req.data.type === "RecommendSparkledCount") {
    return `≥${req.data.count} sparkled ship(s) for a better great success rate`
  }

  if (req.data.type === "Morale") {
    return `All ships in this fleet should have morale ≥${req.data.morale}`
  }

  if (req.data.type === "Resupply") {
    return `All ships in this fleet should be fully resupplied`
  }

  throw "Unhandled Req type: ${req.data.type}"
}

// props:
// - req: either an Req object of non ShipTypeCount, or an array of ShipTypeCount Req objects
// - ok:  a boolean or an array of boolean (for ShipTypeCount array)
// - greatSuccess: whether this is required by GS
class RequirementListItem extends Component {
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
// fleet: fleet representation
// expedId: target expedition id
// greatSuccess: whether aimming at great success
class RequirementViewer extends Component {
  render() {
    const fleet = this.props.fleet
    const normReqObj = expedReqs[ this.props.expedId ]
    const normResultObj = checkAllReq(normReqObj)(fleet)
    const normCheckResult = collapseResults( normResultObj )
    const normPairedObj = _.zip(normReqObj,normResultObj)
    const gsReqObj = expedGSReqs[ this.props.expedId ]
    const gsResultObj = checkAllReq(gsReqObj)(fleet)
    const gsCheckResult = normCheckResult && collapseResults( gsResultObj )
    const gsPairedObj = _.zip(gsReqObj,gsResultObj)
    return (
      <div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <CheckResultBox
              ready={normCheckResult} visible={true}
              content={`Normal: ${normCheckResult? "Ready" : "Not Ready"}`} />
          <CheckResultBox
              ready={gsCheckResult} visible={this.props.greatSuccess}
              content={`Great Success: ${gsCheckResult? "Ready" : "Not Ready"}`} />
        </div>
        <ListGroup>
          { normPairedObj.map( ([req,res],ind) =>
              <RequirementListItem
                  key={`norm-${ind}`}
                  req={req}
                  ok={res}
                  greatSuccess={false} />)}
          { this.props.greatSuccess &&
            gsPairedObj.map( ([req,res],ind) =>
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
