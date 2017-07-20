import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayShipList,
  renderShipList,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('Morale')

const MoraleItem = props => (
  <ItemTemplate
    content={fmt(props.ereq.morale)}
    tooltip={
      !props.result.sat &&
      mayShipList(renderShipList(
        __('RequirementExplain.TTLowMorale')
      ))(props)}
    {...props}
  />
)

MoraleItem.propTypes = {
  ereq: PTyp.object.isRequired,
  result: PTyp.object.isRequired,
}

export { MoraleItem }
