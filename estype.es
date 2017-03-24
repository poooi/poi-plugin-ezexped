/*

   Ship type utils for expeditions

   terms:

   - SType id: consistent with api_stype
   - ESType: ship type viewed from perspective of expeditions,
     one SType could belong to multiple ESTypes
 */

import { readJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const stype = readJsonSync(join(__dirname, 'assets', 'stypes.json'))
const allSTypes = Object.keys( stype )

const throwWithMsg = msg => {
  throw msg
}

// for reverse lookup
const stypeRev = (() => {
  const arr = new Array(allSTypes.length + 1)
  allSTypes.map( styp =>
    arr[ stype[styp] ] = styp)
  return arr
})()

const nameToId = n =>
  stype [n] || throwWithMsg(`invalid stype name: ${n}`)

const idToName = i =>
  stypeRev[i] || throwWithMsg(`invalid stype id: ${i}`)

const isESType = (() => {
  const eq = x => y => x === y
  const oneOf = xs => y => xs.indexOf(y) !== -1
  const t = stype

  return {
    DD: eq(t.DD),
    CL: eq(t.CL),
    CVLike: oneOf([t.CV,t.CVL,t.AV,t.CVB]),
    SSLike: oneOf([t.SS,t.SSV]),
    CA: eq(t.CA),
    BBV: eq(t.BBV),
    AS: eq(t.AS),
    CT: eq(t.CT),
    AV: eq(t.AV),
  }
})()

// check fleet requirement against an array of ship types
// returns "true" if the requirement is met
// otherwise returns a structured description of the requirement itself
const checkFleetSTypes = (count, estypeName) => stypes =>
  (stypes.filter( isESType[estypeName] ).length >= count)
    ? true
    : {type: "ShipType", estype: estypeName, count: count}

export {
  allSTypes,
  nameToId,
  idToName,
  stype,
  isESType,
  checkFleetSTypes,
}
