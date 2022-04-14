import React, { Component } from 'react'

import { PTyp } from '../../../ptyp'
import { EReq } from '../../../structs/ereq'

import { FSLevelItem } from './fs-level-item'
import { FSTypeItem } from './fs-type-item'
import { ShipCountItem } from './ship-count-item'
import { DrumCarrierCountItem } from './drum-carrier-count-item'
import { DrumCountItem } from './drum-count-item'
import { LevelSumItem } from './level-sum-item'
import { GSHigherLevelItem } from './gs-higher-level-item'
import { GSRateNormItem } from './gs-rate-norm-item'
import { GSRateDrumItem } from './gs-rate-drum-item'
import { GSRateFlagItem } from './gs-rate-flag-item'
import { MoraleItem } from './morale-item'
import { ResupplyItem } from './resupply-item'
import { AllSparkledItem } from './all-sparkled-item'
import { FleetCompoItem } from './fleet-compo-item'
import { AnyFleetCompoItem } from './any-fleet-compo-item'
import { FillDlcItem } from './fill-dlc-item'
import { TotalAswItem } from './total-asw-item'
import { TotalAntiAirItem } from './total-anti-air-item'
import { TotalLosItem } from './total-los-item'
import { TotalFirepowerItem } from './total-firepower-item'
import { MissingInfoItem } from './missing-info-item'

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
    GSHigherLevelItem,
    GSRateNormItem,
    GSRateDrumItem,
    GSRateFlagItem,
    MoraleItem,
    ResupplyItem,
    AllSparkledItem,
    FleetCompoItem,
    AnyFleetCompoItem,
    FillDlcItem,
    TotalAswItem,
    TotalAntiAirItem,
    TotalLosItem,
    TotalFirepowerItem,
    MissingInfoItem,
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
      <div
        style={{
          padding: 10,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}>
        {JSON.stringify(this.props.ereq)}
      </div>
    )
  }
}

export { EReqListGroupItem }
