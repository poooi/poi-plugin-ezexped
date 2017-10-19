import React from 'react'
import {
  Tooltip,
} from 'react-bootstrap'

import {
  ItemTemplate,
  formatReqExplain,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('MissingInfo')

const MissingInfoItem = props => (
  <ItemTemplate
    content={fmt()}
    tooltip={(
      <Tooltip
        className="ezexped-pop"
        id={`${props.prefix}detail`}>
        <div style={{maxWidth: '30em'}}>
          {__('RequirementExplain.TTMissingInfo')}
        </div>
      </Tooltip>
    )}
    {...props}
  />
)

MissingInfoItem.propTypes = {
  prefix: PTyp.string.isRequired,
}

export { MissingInfoItem }
