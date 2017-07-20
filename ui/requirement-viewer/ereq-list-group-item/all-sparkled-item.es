import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayShipList,
  renderShipList,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('AllSparkled')

const AllSparkledItem = props => (
  <ItemTemplate
    content={fmt()}
    tooltip={
      !props.result.sat &&
      mayShipList(renderShipList(
        __('RequirementExplain.TTNotSparkled')
      ))(props)}
    {...props}
  />
)

AllSparkledItem.propTypes = {
  result: PTyp.object.isRequired,
}

export { AllSparkledItem }
