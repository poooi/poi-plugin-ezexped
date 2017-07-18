import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('SparkledCount')

const describe = (x,y) => `needs ${y-x} more sparkled ship(s)`

const SparkledCountItem = props => (
  <ItemTemplate
    content={fmt(props.ereq.count)}
    tooltip={mayNeedMore(describe)(props)}
    {...props}
  />
)

SparkledCountItem.propTypes = {
  ereq: PTyp.object.isRequired,
}

export { SparkledCountItem }
