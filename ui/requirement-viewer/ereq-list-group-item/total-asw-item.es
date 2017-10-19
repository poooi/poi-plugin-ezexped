import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('TotalAsw')

const describe = (x,y) => __('RequirementExplain.TTTotalAsw',x,y)

const TotalAswItem = props => (
  <ItemTemplate
    content={fmt(props.ereq.asw)}
    tooltip={mayNeedMore(describe)(props)}
    {...props}
  />
)

TotalAswItem.propTypes = {
  ereq: PTyp.object.isRequired,
}

export { TotalAswItem }
