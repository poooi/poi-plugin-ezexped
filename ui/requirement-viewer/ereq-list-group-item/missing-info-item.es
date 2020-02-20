import React from 'react'
import {
  ItemTemplate,
  formatReqExplain,
} from './common'
import { __ } from '../../../tr'

const fmt = formatReqExplain('MissingInfo')

const MissingInfoItem = props => (
  <ItemTemplate
    content={fmt()}
    tooltip={(
      <div>
        <div style={{maxWidth: '30em'}}>
          {__('RequirementExplain.TTMissingInfo')}
        </div>
      </div>
    )}
    {...props}
  />
)

export { MissingInfoItem }
