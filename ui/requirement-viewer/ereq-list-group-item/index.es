import React, { Component } from 'react'
import {
  ListGroupItem,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { EReq } from '../../../structs/ereq'

import { FSLevelItem } from './fs-level-item'
import { FSTypeItem } from './fs-type-item'
import { ShipCountItem } from './ship-count-item'
import { DrumCarrierCountItem } from './drum-carrier-count-item'
import { DrumCountItem } from './drum-count-item'
import { LevelSumItem } from './level-sum-item'
import { SparkledCountItem } from './sparkled-count-item'
import { SparkledCountCustomItem } from './sparkled-count-custom-item'
import { MoraleItem } from './morale-item'
import { ResupplyItem } from './resupply-item'
import { AllSparkledItem } from './all-sparkled-item'
import { FleetCompoItem } from './fleet-compo-item'
import { AnyFleetCompoItem } from './any-fleet-compo-item'
import { FillDlcItem } from './fill-dlc-item'

const ereqComponents = new Map()

{
  const defineERC = EReqComponent => {
    const reResult = /^(.+)Item$/.exec(EReqComponent.name)
    if (! Array.isArray(reResult)) {
      return console.error(`name ${EReqComponent.name} does not match the pattern`)
    }
    const ereqType = reResult[1]
    if (! EReq.allTypes.includes(ereqType)) {
      return console.error(`not a valid ereq type: ${ereqType}`)
    }
    ereqComponents.set(ereqType, EReqComponent)
  }

  [
    FSLevelItem,
    FSTypeItem,
    ShipCountItem,
    DrumCarrierCountItem,
    DrumCountItem,
    LevelSumItem,
    SparkledCountItem,
    SparkledCountCustomItem,
    MoraleItem,
    ResupplyItem,
    AllSparkledItem,
    FleetCompoItem,
    AnyFleetCompoItem,
    FillDlcItem,
  ].map(defineERC)
}

// completeness check
{
  const missingTypes = EReq.allTypes.filter(ereqType =>
    !ereqComponents.has(ereqType))

  if (missingTypes.length > 0) {
    const missingTypesText = missingTypes.join(', ')
    console.warn(
      `Missing EReq Component for following types: ${missingTypesText}`
    )
  }
}

class EReqListGroupItem extends Component {
  static propTypes = {
    ereq: PTyp.shape({
      type: PTyp.EReqType.isRequired,
    }).isRequired,
  }

  render() {
    const ereqType = this.props.ereq.type
    if (ereqComponents.has(ereqType)) {
      const EReqComponent = ereqComponents.get(ereqType)
      return (
        <EReqComponent
          {...this.props}
        />
      )
    }

    return (
      <ListGroupItem
        style={{padding: 10}}>
        {JSON.stringify(this.props.ereq)}
      </ListGroupItem>
    )
  }
}

export { EReqListGroupItem }
