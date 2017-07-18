import { EReq } from '../structs/ereq'

const mk = EReq.make

// fslSc is short for 'flagship level and ship count'
const fslSc = (fsl,sc) =>
  [mk.FSLevel(fsl), mk.ShipCount(sc)]

const escortSpecialFleetCompos =
  mk.AnyFleetCompo([
    {CL: 1, DD: 2},
    {DD: 1, DE: 3},
    {CL: 1, DE: 2},
    {CT: 1, DE: 2},
    {CVE: 1, DE: 2},
    {CVE: 1, DD: 2},
  ])

export {
  mk,
  fslSc,
  escortSpecialFleetCompos,
}
