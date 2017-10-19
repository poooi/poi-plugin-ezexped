import React from 'react'
import {
  Tooltip,
} from 'react-bootstrap'

import {
  ItemTemplate,
  getExtraType,
} from './common'

import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

/* eslint-disable react/prop-types */
const mayFillDlc = props =>
  getExtraType(props) === 'FillDlc' ? (
    <Tooltip
      className="ezexped-pop"
      id={`${props.prefix}detail`}>
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
    </Tooltip>
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
