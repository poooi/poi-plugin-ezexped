import React from 'react'
import _ from 'lodash'

import {
  ItemTemplate,
  formatReqExplain,
  mayNoFlagship,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('GSRate')

const describe = x => {
  const needShips = Math.ceil((100 - x) / 15 * 0.99)
  return needShips > 0 ? (
    <div>
      {__('RequirementExplain.TTNeedsMoreSparkledShips',needShips > 6 ? 6 : needShips)}
    </div>
  ) : null
}

const GSRateFlagItem = props => {
  const rate = _.isFinite(props.result.extra.rate) ? props.result.extra.rate : 0
  const tooltip = mayNoFlagship(props) || describe(rate)

  return (
    <ItemTemplate
      content={fmt(rate)}
      tooltip={tooltip}
      {...props}
    />)
}

GSRateFlagItem.propTypes = {
  ereq: PTyp.object.isRequired,
  result: PTyp.object.isRequired,
}

export { GSRateFlagItem }
