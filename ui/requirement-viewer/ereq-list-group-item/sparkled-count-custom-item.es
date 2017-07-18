import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('SparkledCountCustom')

const describe = (x,y) => `needs ${y-x} more sparkled ship(s)`

const SparkledCountCustomItem = props => (
  <ItemTemplate
    content={fmt(props.result.extra.sparkledCount)}
    tooltip={
      !props.result.sat &&
      mayNeedMore(describe,'SparkledCountCustom')(props)
    }
    {...props}
  />
)

SparkledCountCustomItem.propTypes = {
  result: PTyp.object.isRequired,
}

export { SparkledCountCustomItem }
