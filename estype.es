/*

   Ship type utils for expeditions

   terms:

   - SType id: consistent with api_stype
   - ESType: ship type viewed from perspective of expeditions,
     one SType could belong to multiple ESTypes
 */

import { readJsonSync } from 'fs-extra'
import { join } from 'path-extra'
import { throwWith } from './utils'

const stype = readJsonSync(join(__dirname, 'assets', 'stypes.json'))
const allSTypes = Object.keys( stype )
// import { __ } from './tr'

// for reverse lookup
const stypeRev = (() => {
  const arr = new Array(allSTypes.length + 1)
  allSTypes.map( styp =>
    arr[ stype[styp] ] = styp)
  return arr
})()

const nameToId = n =>
  stype [n] || throwWith(`invalid stype name: ${n}`)

const idToName = i =>
  stypeRev[i] || throwWith(`invalid stype id: ${i}`)

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

const shortDesc = estypeName =>
    estypeName === "CVLike" ? "CV*"
  : estypeName === "SSLike" ? "SS*"
  : estypeName

// note: in order to keep this module pure for testing,
// one has to provide a translating function, which for now is "__" from "tr.es"
const longDesc = __ => estypeName => {
  const text = `ShipTypeNameLong.${estypeName}`
  const translated = __(text)
  if (text === translated)
    console.warn(`unknown estype or missing translation: ${estypeName}`)

  return translated
}

export {
  allSTypes,
  nameToId,
  idToName,
  stype,
  isESType,

  shortDesc,
  longDesc,
}
