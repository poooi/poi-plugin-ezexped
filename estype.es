/*

   Ship type utils for expeditions

   terms:

   - SType id: consistent with api_stype
   - ESType: ship type viewed from perspective of expeditions,
     one SType could belong to multiple ESTypes
 */
import _ from 'lodash'
import { readJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const stype = readJsonSync(join(__dirname, 'assets', 'stypes.json'))
const allSTypes = Object.keys(stype)

/*
{
  const {getStore} = window
  const allCVLs = _.values(getStore().const.$ships).filter(x => x.api_stype === 7)
  const wctfShips = getStore().wctf.ships
  const allCVEs = allCVLs.filter(x => {
    if (!(x.api_id in wctfShips))
      return false
    const asw = _.get(wctfShips, [x.api_id, 'stat', 'asw_max'])
    return _.isNumber(asw) && asw > 0
  })

  console.log(allCVEs.map(x => [x.api_name, x.api_id]))
}
*/

const [isESType, allESTypes] = (() => {
  const eq = x => y => x === y
  const oneOf = xs => y => xs.includes(y)
  const t = stype

  const $isESType = {}
  const $allESTypes = []

  const defineESType = (name, func) => {
    $isESType[name] = func
    $allESTypes.push(name)
  }

  defineESType('SSLike', oneOf([t.SS,t.SSV]))
  defineESType('DE', eq(t.DE))
  defineESType('DD', eq(t.DD))
  defineESType('CL', eq(t.CL))
  defineESType('CT', eq(t.CT))
  defineESType('CA', eq(t.CA))
  defineESType('AS', eq(t.AS))
  /*
     TODO: it might actually be possible to derive CVE checking from wctf / game data:
     (1) it must be CVL (2) it's ASW is not zero (use "asw_max" for asw stat at level 99)

   */
  defineESType('CVE', (styp, mstId) => styp === t.CVL && [526, 380, 529].includes(mstId))
  defineESType('AV', eq(t.AV))
  defineESType('CVLike', oneOf([t.CV,t.CVL,t.AV,t.CVB]))
  defineESType('BBV', eq(t.BBV))
  defineESType('DDorDE', oneOf([t.DD,t.DE]))

  return [$isESType, $allESTypes]
})()

/* eslint-disable indent */
const shortDesc = estypeName =>
  estypeName === "CVLike" ? "CV*" :
  estypeName === "SSLike" ? "SS*" :
  estypeName === "DDorDE" ? "DD/DE" :
  estypeName
/* eslint-enable indent */

// note: in order to keep this module pure for testing,
// one has to provide a translating function, which for now is "__" from "tr.es"
const longDesc = __ => estypeName => {
  const text = `ShipTypeNameLong.${estypeName}`
  const translated = __(text)
  if (text === translated)
    console.warn(`unknown estype or missing translation: ${estypeName}`)

  return translated
}

const esFleetCompoToPairs = (() => {
  // by convention we make "heavier" ships go first
  const revAllESTypes = [...allESTypes].reverse()

  return fleetCompo => _.flatMap(
    revAllESTypes,
    estype => (estype in fleetCompo) ?
      [[estype, fleetCompo[estype]]] :
      []
  )
})()

export {
  allSTypes,
  stype,
  isESType,
  allESTypes,

  shortDesc,
  longDesc,
  esFleetCompoToPairs,
}
