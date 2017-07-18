import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNeedMore,
} from './common'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('LevelSum')

const describe = (x,_y) => `Current total level: ${x}`

const LevelSumItem = props => (
  <ItemTemplate
    content={fmt(props.ereq.level)}
    tooltip={mayNeedMore(describe)(props)}
    {...props}
  />
)

LevelSumItem.propTypes = {
  ereq: PTyp.object.isRequired,
}

export { LevelSumItem }
