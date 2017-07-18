import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayShipList,
  renderShipList,
} from './common'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('Morale')

const MoraleItem = props => (
  <ItemTemplate
    content={fmt(props.ereq.morale)}
    tooltip={
      !props.result.sat &&
      mayShipList(renderShipList(
        'Low morale ships:'
      ))(props)}
    {...props}
  />
)

MoraleItem.propTypes = {
  ereq: PTyp.object.isRequired,
  result: PTyp.object.isRequired,
}

export { MoraleItem }
