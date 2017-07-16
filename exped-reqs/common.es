import { EReq } from '../structs/ereq'

const mk = EReq.make

// fslSc is short for 'flagship level and ship count'
const fslSc = (fsl,sc) =>
  [mk.FSLevel(fsl), mk.ShipCount(sc)]

export {
  mk,
  fslSc,
}
