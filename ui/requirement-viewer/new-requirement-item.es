import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import {
  OverlayTrigger, Tooltip,
} from 'react-bootstrap'

import { __ } from '../../tr'
import { PTyp } from '../../ptyp'
import * as estype from '../../estype'

const renderRequirement = (ereq, _result, prefix, extraResults) => {
  const fmt = (...args) =>
    __(`RequirementExplain.${ereq.type}`, ...args)

  if (ereq.type === "FSType") {
    return fmt(estype.longDesc(__)(ereq.estype))
  }

  if (ereq.type === "FSLevel") {
    return fmt(ereq.level)
  }

  if (ereq.type === "ShipCount") {
    return fmt(ereq.count)
  }

  if (ereq.type === "DrumCarrierCount") {
    return fmt(ereq.count)
  }

  if (ereq.type === "DrumCount") {
    return fmt(ereq.count)
  }

  if (ereq.type === "LevelSum") {
    return fmt(ereq.sum)
  }

  if (ereq.type === "SparkledCount") {
    return fmt(ereq.count)
  }

  /*
  if (ereq.type === "RecommendSparkledCount") {
    return fmt(ereq.count)
  }
  */

  if (ereq.type === "Morale") {
    return fmt(ereq.morale)
  }

  if (ereq.type === "Resupply") {
    return fmt()
  }

  if (ereq.type === "AllSparkled") {
    return fmt()
  }

  // TODO: SparkledCountCustom

  if (ereq.type === 'FleetCompo') {
    const {compo} = ereq
    return (
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id={`${prefix}-req-detail`} className="ezexped-pop">
            <div style={{display: "flex", flexDirection: "column"}}>
              {
                Object.keys(compo).map(estypeK => {
                  const count = compo[estypeK]
                  const actualCount = extraResults[estypeK]
                  const sat = actualCount >= count
                  return (
                    <div
                      key={estypeK}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                      <FontAwesome
                        style={{marginRight: "5px", marginTop: "2px"}}
                              name={sat ? "check-square-o" : "square-o"} />
                      <div style={{flex: "1", whiteSpace: "nowrap"}}>
                        {`${estype.longDesc(__)(estypeK)} x ${actualCount} / ${count}`}
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </Tooltip>
        }>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div key="header">{__("Fleet Composition")}:</div>
          {
            Object.keys(compo).map(estypeK => {
              const count = compo[estypeK]
              const actualCount = extraResults[estypeK]
              const sat = actualCount >= count
              return (
                <div
                  style={{
                    marginLeft: "5px",
                    color: sat ? 'green' : 'red',
                  }}
                  key={`ce-${estypeK}`}>
                  {`${count}${estype.shortDesc(estypeK)}`}
                </div>
              )
            })
          }
        </div>
      </OverlayTrigger>
    )
  }

  return JSON.stringify(ereq)
}

class NewRequirementItem extends Component {
  static propTypes = {
    ereq: PTyp.object.isRequired,
    result: PTyp.object.isRequired,
    which: PTyp.oneOf(['norm','resupply','gs']).isRequired,
    prefix: PTyp.string.isRequired,
  }

  render() {
    const {ereq,result,which,prefix} = this.props
    const {sat,tooltip} = result
    const checkboxColor = sat ?
      (which === 'gs' ? 'gold' : 'green') :
      (which === 'gs' ? 'grey' : 'red')

    const content = (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <FontAwesome
          style={{
            color: checkboxColor,
            marginRight: '.4em',
          }}
          name={sat ? 'check-square-o' : 'square-o'}
        />
        <div>
          {renderRequirement(ereq, result, prefix, tooltip)}
        </div>
      </div>
    )

    return result.tooltip ? (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`${prefix}-tt`}>
            {JSON.stringify(result.tooltip)}
          </Tooltip>
        }
      >
        {content}
      </OverlayTrigger>
    ) : (
      content
    )
  }
}

export { NewRequirementItem }
