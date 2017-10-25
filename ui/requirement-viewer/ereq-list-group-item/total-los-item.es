import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('TotalLos')

const describe = (x,y) => __('RequirementExplain.TTTotalLos',x,y)

const TotalLosItem = props => (
  <ItemTemplate
    content={fmt(props.ereq.los)}
    tooltip={mayNeedMore(describe)(props)}
    {...props}
  />
)

TotalLosItem.propTypes = {
  ereq: PTyp.object.isRequired,
}

export { TotalLosItem }
