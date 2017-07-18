import React from 'react'

import {
  ItemTemplate,
  formatReqExplain,
  mayNoFlagship,
} from './common'
import { PTyp } from '../../../ptyp'
import { __ } from '../../../tr'
import * as estype from '../../../estype'

const fmt = formatReqExplain('FSType')

const FSTypeItem = props => (
  <ItemTemplate
    content={fmt(estype.longDesc(__)(props.ereq.estype))}
    tooltip={mayNoFlagship(props)}
    {...props}
  />
)

FSTypeItem.propTypes = {
  ereq: PTyp.object.isRequired,
}

export { FSTypeItem }
