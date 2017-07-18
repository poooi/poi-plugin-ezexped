import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('DrumCount')

const describe = (x,y) => `needs to carry ${y-x} more drum(s)`

const DrumCountItem = props => (
  <ItemTemplate
    content={fmt(props.ereq.count)}
    tooltip={mayNeedMore(describe)(props)}
    {...props}
  />
)

DrumCountItem.propTypes = {
  ereq: PTyp.object.isRequired,
}

export { DrumCountItem }
