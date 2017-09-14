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

const mayFillDlc = props =>
  getExtraType(props) === 'FillDlc' ? (
    <Tooltip
      className="ezexped-pop"
      id={`${props.prefix}detail`}>
      {
        props.result.extra.ships.map(s => (
          <div key={s.mstId}>
            {`${s.name} Lv.${s.level} can carry ${s.extraDlcCapability} more Daihatsu-class equipment(s)`}
          </div>
        ))
      }
    </Tooltip>
  ) : null

const FillDlcItem = props => (
  <ItemTemplate
    content={"Carry as many Daihatsu-class equipments as possible"}
    tooltip={
      !props.result.sat &&
      mayFillDlc(props)
    }
    {...props}
  />
)

FillDlcItem.propTypes = {
  ereq: PTyp.object.isRequired,
  result: PTyp.object.isRequired,
}

export { FillDlcItem }
