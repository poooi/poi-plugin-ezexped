import React from 'react'
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
      <div>
        <div style={{maxWidth: '30em'}}>
          {__('RequirementExplain.TTMissingInfo')}
        </div>
      </div>
    )}
    {...props}
  />
)

MissingInfoItem.propTypes = {
  prefix: PTyp.string.isRequired,
}

export { MissingInfoItem }
