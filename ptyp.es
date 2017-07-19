import { PropTypes } from 'prop-types'
import { EReq } from './structs/ereq'

// PTyp is just short for PropTypes.
// In addition, this allows us to collect validation logic
// in one place

const allRequired = shapeObj => {
  const ret = {}
  Object.keys(shapeObj).map(k => {
    const original = shapeObj[k]
    ret[k] = typeof original.isRequired !== 'undefined'
      ? original.isRequired
      : PropTypes.oneOfType([original]).isRequired
  })
  return ret
}

const FleetIndex = PropTypes.oneOf([0,1,2,3])
const FleetId = PropTypes.oneOf([1,2,3,4])

const EReqType = PropTypes.oneOf(EReq.allTypes)
const EReqWhich = PropTypes.oneOf(['norm','resupply','gs'])

const DarkOrLight = PropTypes.oneOf(['dark','light'])

const PTyp = {
  ...PropTypes,
  allRequired,
  FleetIndex,
  FleetId,

  EReqType,
  EReqWhich,
  DarkOrLight,
}

export {
  PTyp,
}
