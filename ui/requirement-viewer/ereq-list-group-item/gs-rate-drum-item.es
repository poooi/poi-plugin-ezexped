import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('GSRate')

const describe = (x, y) => {
  const needShips = Math.ceil((y - x) / 15 * 0.99)
  return needShips > 0 ? (
    <div>
      {__('RequirementExplain.TTNeedsMoreSparkledShips',needShips > 6 ? 6 : needShips)}
    </div>
  ) : null
}

const GSRateDrumItem = props => (
  <ItemTemplate
    content={fmt(props.result.extra.rate)}
    tooltip={describe(props.result.extra.rate, props.result.extra.custom)}
    {...props}
  />
)

GSRateDrumItem.propTypes = {
  ereq: PTyp.object.isRequired,
  result: PTyp.object.isRequired,
}

export { GSRateDrumItem }
