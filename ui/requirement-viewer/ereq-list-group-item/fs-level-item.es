import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNoFlagship,
} from './common'
import { PTyp } from '../../../ptyp'

const fmt = formatReqExplain('FSLevel')

const FSLevelItem = props => (
  <ItemTemplate
    content={fmt(props.ereq.level)}
    tooltip={mayNoFlagship(props)}
    {...props}
  />
)

FSLevelItem.propTypes = {
  ereq: PTyp.object.isRequired,
}

export { FSLevelItem }
