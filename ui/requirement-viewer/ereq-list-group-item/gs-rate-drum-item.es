import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('GSRate')

const describe = (x) => {
  const needShips = Math.ceil((100 - x) / 15 * 0.99)
  return needShips > 0 ? (<div>
    {__('RequirementExplain.TTNeedsMoreSparkledShips',needShips > 6 ? 6 : needShips)}
  </div>) : null
}

const GSRateDrumCheck = props =>
  props.result.extra.drum >= props.ereq.max ? props.result.extra.rate :
  props.ereq.min === 0 ? (props.result.extra.rate - 20.2) :
  props.result.extra.drum >= props.ereq.min ? (props.result.extra.rate - 35.35) : 0

const GSRateDrumItem = props => {
  props.result.sat = GSRateDrumCheck(props) >= 100
  return (<ItemTemplate
    content={fmt(GSRateDrumCheck(props))}
    tooltip={describe(GSRateDrumCheck(props))}
    {...props}
  />
)}

GSRateDrumItem.propTypes = {
  ereq: PTyp.object.isRequired,
}

export { GSRateDrumItem }
