import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayShipList,
  renderShipList,
} from './common'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('Resupply')

const ResupplyItem = props => (
  <ItemTemplate
    content={fmt()}
    tooltip={
      !props.result.sat &&
      mayShipList(renderShipList(
        'Needs resupply:'
      ))(props)}
    {...props}
  />
)

ResupplyItem.propTypes = {
  result: PTyp.object.isRequired,
}

export { ResupplyItem }
