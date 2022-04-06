import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayShipList,
  renderShipList,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('GSHigherLevel')

const GSHigherLevelItem = props => (
  <ItemTemplate
    content={fmt()}
    tooltip={
      !props.result.sat &&
      mayShipList(renderShipList(
        __('RequirementExplain.TTHigherLevel')
      ))(props)
    }
    {...props}
  />
)

GSHigherLevelItem.propTypes = {
  result: PTyp.object.isRequired,
}

export { GSHigherLevelItem }
