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
            style={{marginRight: "5px", marginTop: "2px"}}
            name={this.props.ready ? "check-square-o" : "square-o"} />
        <div>{this.props.content}</div>
      </Button>
    )}}

const collapseResults = xs =>
  Array.isArray(xs)
    ? xs.every( collapseResults )
    : xs

// TODO: refine non-ShipTypeCount Req rendering method, remove renderReqData.
// TODO: use tooltip for showing ShipTypeCount rendering in detail

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

    const renderShipTypeCountArray = ar => 
      <div style={{display: "flex"}}>
        {ar.map( ({data: {count, estype}}, ind) => 
          <div 
              style={{marginRight:"5px", color: this.props.ok[ind] ? "green" : "red" }}
              key={`ce-${ind}`} >
            {`${count}${estype}`}
          </div> )}
      </div>
    return (
      <ListGroupItem 
          style={{padding: "10px", display: "flex"}}>
        <FontAwesome
            style={{marginRight: "5px", color: checkBoxColor }}
            name={allOk ? "check-square-o" : "square-o"} />
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
