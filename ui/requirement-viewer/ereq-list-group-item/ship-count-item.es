import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('ShipCount')

const describe = (x,y) => `needs ${y-x} more ship(s)`

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
