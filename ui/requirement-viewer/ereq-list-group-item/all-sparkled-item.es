import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayShipList,
  renderShipList,
} from './common'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('AllSparkled')

const AllSparkledItem = props => (
  <ItemTemplate
    content={fmt()}
    tooltip={
      !props.result.sat &&
      mayShipList(renderShipList(
        'Not sparkled:'
      ))(props)}
    {...props}
  />
)

AllSparkledItem.propTypes = {
  result: PTyp.object.isRequired,
}

export { AllSparkledItem }
