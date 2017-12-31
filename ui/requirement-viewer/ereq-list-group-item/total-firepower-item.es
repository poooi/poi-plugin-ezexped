import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('TotalFirepower')

const describe = (x,y) => __('RequirementExplain.TTTotalFirepower',x,y)

const TotalFirepowerItem = props => (
  <ItemTemplate
    content={fmt(props.ereq.antiAir)}
    tooltip={mayNeedMore(describe)(props)}
    {...props}
  />
)

TotalFirepowerItem.propTypes = {
  ereq: PTyp.object.isRequired,
}

export { TotalFirepowerItem }
