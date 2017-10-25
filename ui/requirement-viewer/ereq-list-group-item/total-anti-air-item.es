import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('TotalAntiAir')

const describe = (x,y) => __('RequirementExplain.TTTotalAntiAir',x,y)

const TotalAntiAirItem = props => (
  <ItemTemplate
    content={fmt(props.ereq.antiAir)}
    tooltip={mayNeedMore(describe)(props)}
    {...props}
  />
)

TotalAntiAirItem.propTypes = {
  ereq: PTyp.object.isRequired,
}

export { TotalAntiAirItem }
