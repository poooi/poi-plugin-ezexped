import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('GSRate')

const describe = (x,y) => {
  const needShips = Math.ceil((y - x) / 15 * 0.99)
  return __('RequirementExplain.TTNeedsMoreSparkledShips',needShips > 6 ? 6 : needShips > 0 ? needShips : 0)
}

const GSRateNormItem = props => (
  <ItemTemplate
    content={fmt(props.result.extra.left)}
    tooltip={mayNeedMore(describe)(props)}
    {...props}
  />
)

GSRateNormItem.propTypes = {
  ereq: PTyp.object.isRequired,
}

export { GSRateNormItem }
