import FontAwesome from 'react-fontawesome'
import { _ } from 'lodash'
import React, { Component } from 'react'
import {
  ListGroupItem,
  OverlayTrigger, Tooltip,
} from 'react-bootstrap'

import {
  collapseResults,
  isEqualReqObj,
} from '../../requirement'

import * as estype from '../../estype'
import { __ } from '../../tr'
import { error } from '../../utils'
import { PTyp } from '../../ptyp'

const renderRequirement = (req,ok) => {
  if (Array.isArray(req)) {
    const tooltip = (<Tooltip id="eq-stc-req-tooltip" className="ezexped-pop">
      <div style={{display: "flex", flexDirection: "column"}}>
        {
          req.map( ({data},ind) => (
            <div key={ind} style={{flex: "1", display: "flex"}}>
              <FontAwesome
                style={{marginRight: "5px", marginTop: "2px"}}
                name={ok[ind] ? "check-square-o" : "square-o"} />
              <div style={{flex: "1", whiteSpace: "nowrap"}}>
                {`${estype.longDesc(__)(data.estype)} x ${data.count}`}
              </div>
            </div>))}
      </div>
    </Tooltip>)

    // every object in this array should be of type "ShipTypeCount"
    return (
      <OverlayTrigger
        placement="bottom" overlay={tooltip}>
        <div style={{display: "flex"}}>
          <div key="header">{__("Fleet Composition")}:</div>
          {
            req.map( ({data: {count, estype: estypeName}}, ind) => (
              <div
                style={{marginLeft: "5px", color: ok[ind] ? "green" : "red" }}
                key={`ce-${ind}`} >
                {`${count}${estype.shortDesc(estypeName)}`}
              </div>
            ))
          }
        </div>
      </OverlayTrigger>
    )
  }

  const fmt = (...args) =>
    __(`RequirementExplain.${req.data.type}`, ...args)

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

  if (req.data.type === "AllSparkled") {
    return fmt()
  }

  return error(`Unhandled Req type: ${req.data.type}`)
}

// props:
// - req: either an Req object of non ShipTypeCount, or an array of ShipTypeCount Req objects
// - ok:  a boolean or an array of boolean (for ShipTypeCount array)
// - greatSuccess: whether this is required by GS
// - hideSatReqs
class RequirementListItem extends Component {
  static propTypes = {
    greatSuccess: PTyp.bool.isRequired,
    ok: PTyp.oneOfType([
      PTyp.bool,
      PTyp.arrayOf(PTyp.bool),
    ]).isRequired,
    req: PTyp.oneOfType([
      PTyp.object,
      PTyp.arrayOf(PTyp.object),
    ]).isRequired,
    hideSatReqs: PTyp.bool.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.ok !== nextProps.ok ||
      this.props.greatSuccess !== nextProps.greatSuccess ||
      this.props.hideSatReqs !== nextProps.hideSatReqs ||
      ! isEqualReqObj(this.props.req, nextProps.req)
  }

  render() {
    const allOk = collapseResults( this.props.ok )
    if (allOk && this.props.hideSatReqs)
      return null

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
      </ListGroupItem>
    )
  }
}

export {
  RequirementListItem,
}
