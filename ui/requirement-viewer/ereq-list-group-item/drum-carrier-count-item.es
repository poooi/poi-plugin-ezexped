import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('DrumCarrierCount')

const describe = (x,y) => `needs ${y-x} more ship(s) to carry drums`

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
