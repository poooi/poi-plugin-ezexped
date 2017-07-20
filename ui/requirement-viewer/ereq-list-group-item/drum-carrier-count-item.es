import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('DrumCarrierCount')

const describe = (x,y) => __('RequirementExplain.TTNeedsMoreDrumCarriers',y-x)

const DrumCarrierCountItem = props => (
  <ItemTemplate
    content={fmt(props.ereq.count)}
    tooltip={mayNeedMore(describe)(props)}
    {...props}
  />
)

DrumCarrierCountItem.propTypes = {
  ereq: PTyp.object.isRequired,
}

export { DrumCarrierCountItem }
