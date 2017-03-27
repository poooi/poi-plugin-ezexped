import React, { Component } from 'react'

const { _, FontAwesome } = window

import {
  Button,
  ListGroup, ListGroupItem,
} from 'react-bootstrap'

import { expedReqs, expedGSReqs, checkAllReq, renderReqData } from './requirement'

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
            style={{marginRight: "5px"}}
            name={this.props.ready ? "check-square-o" : "square-o"} />
        <div>{this.props.content}</div>
      </Button>
    )}}

const collapseResults = xs =>
  Array.isArray(xs)
    ? xs.every( collapseResults )
    : xs

// TODO: refine non-ShipTypeCount Req rendering method, remove renderReqData.
// TODO: allow each ShipTypeCount to have separated colors
// TODO: use tooltip for showing ShipTypeCount rendering in detail

// props:
// - key
// - req: either an Req object of non ShipTypeCount, or an array of ShipTypeCount Req objects
// - ok: whether this requirement is met
// - greatSuccess: whether this is required by GS
class RequirementListItem extends Component {
  render() {
    const checkBoxColor = this.props.ok 
      ? (this.props.greatSuccess 
          ? "gold" : "green") 
      : (this.props.greatSuccess
          ? "grey" : "red")

    const renderShipTypeCountArray = ar => 
      ar.map( ({data: {count, estype}}) => `${count}${estype}`).join(" ")
    return (
      <ListGroupItem 
          key={this.props.key} style={{padding: "10px"}}>
        <FontAwesome
            style={{marginRight: "5px", color: checkBoxColor }}
            name={this.props.ok ? "check-square-o" : "square-o"} />
        { Array.isArray(this.props.req) 
            ? renderShipTypeCountArray(this.props.req)
            : renderReqData(this.props.req.data)
        }
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

    // const unmetReqs = collectUnmetReqs(normReqObj,normResultObj).map( x => renderReqData(x.data) )
    const gsReqObj = expedGSReqs[ this.props.expedId ]
    const gsResultObj = checkAllReq(gsReqObj)(fleet)
    const gsCheckResult = normCheckResult && collapseResults( gsResultObj )
    const gsPairedObj = _.zip(gsReqObj,gsResultObj)

    // const unmetReqsGS = collectUnmetReqs(gsReqObj,gsResultObj).map(x => "GS:"+ renderReqData(x.data))
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
                  ok={collapseResults(res)}
                  greatSuccess={false} />)}
          { this.props.greatSuccess &&
            gsPairedObj.map( ([req,res],ind) =>
              <RequirementListItem
                  key={`gs-${ind}`}
                  req={req}
                  ok={collapseResults(res)}
                  greatSuccess={true}
              />) }
        </ListGroup>
      </div>
    )
  }
}

export { RequirementViewer }
