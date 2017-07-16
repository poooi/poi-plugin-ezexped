import { PropTypes } from 'prop-types'

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

const PTyp = {
  ...PropTypes,
  allRequired,
  FleetIndex,
  FleetId,
}

export {
  PTyp,
}
