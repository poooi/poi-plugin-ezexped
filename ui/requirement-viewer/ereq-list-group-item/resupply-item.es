import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayShipList,
  renderShipList,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('Resupply')

const ResupplyItem = props => (
  <ItemTemplate
    content={fmt()}
    tooltip={
      !props.result.sat &&
      mayShipList(renderShipList(
        __('RequirementExplain.TTResupply')
      ))(props)}
    {...props}
  />
)

ResupplyItem.propTypes = {
  result: PTyp.object.isRequired,
}

export { ResupplyItem }
