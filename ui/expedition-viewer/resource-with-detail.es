import React, { Component } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { __ } from '../../tr'
import { PTyp } from '../../ptyp'

import { IconAndLabel } from './icon-and-label'

class ResourceWithDetail extends Component {
  static propTypes = {
    resourceName: PTyp.string.isRequired,
    icon: PTyp.node.isRequired,
    // - one of "renderedResources"'s value in "ExpeditionViewer"
    renderedResource: PTyp.object.isRequired,
  }
  render() {
    // "123Text" => "123"
    const rmText = t => t.slice(0,t.length-4)
    const translateKey = keyName => __(`IncomeExplain.${rmText(keyName)}`)
    const tooltipTexts = [
      "basicIncomeText",
      "aveImpText",
      "dhtBonusText",
      "tokuBonusText",
      "totalIncomeText",
      "netIncomeText",
    ].filter( k => this.props.renderedResource[k] )
    // .map( k => `${translateKey(k)}: ${this.props.renderedResource[k]}`)
    const tooltip = (
      <Tooltip
          className="ezexped-pop"
          style={{display: "flex"}}
          id={`tooltip-${this.props.resourceName}`}>
        {
          tooltipTexts.map(x => (
            <div style={{flex: "1", textAlign: "left"}} key={x}>
              {
                `${translateKey(x)}: ${this.props.renderedResource[x]}`
              }
            </div>
          ))
        }
      </Tooltip>
    )

    return (
      <OverlayTrigger
        placement="bottom" overlay={tooltip}>
        <div>
          <IconAndLabel
            icon={this.props.icon}
            label={this.props.renderedResource.finalIncome} />
        </div>
      </OverlayTrigger>)
  }
}

export { ResourceWithDetail }
