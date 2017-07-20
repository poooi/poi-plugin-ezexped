import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('SparkledCountCustom')

const describe = (x,y) =>
  __('RequirementExplain.TTNeedsMoreSparkledShips',y-x)

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
