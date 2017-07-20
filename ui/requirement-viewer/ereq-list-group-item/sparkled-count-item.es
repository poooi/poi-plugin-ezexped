import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('SparkledCount')

const describe = (x,y) =>
  __('RequirementExplain.TTNeedsMoreSparkledShips',y-x)

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
