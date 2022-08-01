import React, { Component } from 'react'
import styled from 'styled-components'
import { Position } from '@blueprintjs/core'
import { Tooltip } from 'views/components/etc/overlay'

import { __ } from '../../tr'
import { PTyp } from '../../ptyp'

import { IconAndLabel } from './icon-and-label'

const RTooltip = styled(Tooltip)`
  & .bp4-popover-target {
    width: 100%;
  }

  & .bp3-popover-target {
    width: 100%;
  }
`

class ResourceWithDetail extends Component {
  static propTypes = {
    icon: PTyp.node.isRequired,
    // - one of "renderedResources"'s value in "ExpeditionViewer"
    renderedResource: PTyp.oneOfType([
      PTyp.object,
      PTyp.string,
    ]).isRequired,
  }

  simpleRender = () => (
    <div>
      <IconAndLabel
        icon={this.props.icon}
        label={this.props.renderedResource}
      />
    </div>
  )

  render() {
    if (typeof this.props.renderedResource === 'string') {
      return this.simpleRender()
    }

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
    ].filter(k => this.props.renderedResource[k])

    const tooltip = (
      <div
        style={{display: 'flex', flexDirection: 'column'}}
      >
        {
          tooltipTexts.map(x => (
            <div style={{flex: "1", textAlign: "left"}} key={x}>
              {
                `${translateKey(x)}: ${this.props.renderedResource[x]}`
              }
            </div>
          ))
        }
      </div>
    )

    return (
      <RTooltip
        position={Position.BOTTOM}
        content={tooltip}>
        <IconAndLabel
          icon={this.props.icon}
          label={this.props.renderedResource.finalIncome}
        />
      </RTooltip>
    )
  }
}

export { ResourceWithDetail }
