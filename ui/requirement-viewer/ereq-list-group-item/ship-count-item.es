import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('ShipCount')

const describe = (x,y) => __('RequirementExplain.TTNeedsMoreShips', y-x)

const ShipCountItem = props => (
  <ItemTemplate
    content={fmt(props.ereq.count)}
    tooltip={mayNeedMore(describe)(props)}
    {...props}
  />
)

ShipCountItem.propTypes = {
  ereq: PTyp.object.isRequired,
}

export { ShipCountItem }
