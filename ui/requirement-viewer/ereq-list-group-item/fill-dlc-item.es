import React from 'react'
import {
  ItemTemplate,
  getExtraType,
} from './common'

import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

/* eslint-disable react/prop-types */
const mayFillDlc = props =>
  getExtraType(props) === 'FillDlc' ? (
    <div>
      {
        props.result.extra.ships.map(s => (
          <div key={s.mstId}>
            {
              __(
                'RequirementExplain.TTShipCanCarryMoreDlc',
                `${s.name} Lv.${s.level}`,
                String(s.extraDlcCapability)
              )
            }
          </div>
        ))
      }
    </div>
  ) : null
/* eslint-enable react/prop-types */

const FillDlcItem = props => (
  <ItemTemplate
    content={__('RequirementExplain.FillDlc')}
    tooltip={
      !props.result.sat &&
      mayFillDlc(props)
    }
    {...props}
  />
)

FillDlcItem.propTypes = {
  result: PTyp.object.isRequired,
}

export { FillDlcItem }
