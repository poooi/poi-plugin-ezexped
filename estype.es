/*

   Ship type utils for expeditions

   terms:

   - SType id: consistent with api_stype
   - ESType: ship type viewed from perspective of expeditions,
     one SType could belong to multiple ESTypes
 */
import _ from 'lodash'
import { createSelector } from 'reselect'
import { readJsonSync } from 'fs-extra'
import { join } from 'path-extra'
import { constSelector, wctfSelector } from 'views/utils/selectors'

const stype = readJsonSync(join(__dirname, 'assets', 'stypes.json'))
const allSTypes = Object.keys(stype)

const allCVEIdsSelector = createSelector(
  constSelector,
  wctfSelector,
  ({$ships}, wctf) => {
    const allCVLs = _.values($ships).filter(x => x.api_stype === 7)
    const wctfShips = _.get(wctf, 'ships') || {}
    const allCVEs = allCVLs.filter(x => {
      if (!(x.api_id in wctfShips))
        return false
      const asw = _.get(wctfShips, [x.api_id, 'stat', 'asw_max'])
      return _.isNumber(asw) && asw > 0
    })
    return allCVEs.map(x => x.api_id)
  }
)

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
  defineESType('CVL', eq(t.CVL))
  /*
     TODO: it might actually be possible to derive CVE checking from wctf / game data:
     (1) it must be CVL (2) it's ASW is not zero (use "asw_max" for asw stat at level 99)
   */
  defineESType('CVE', (styp, mstId) =>
    styp === t.CVL && [
      // 大鷹
      526,
      // 大鷹改
      380,
      // 大鷹改二
      529,
      // Gambier Bay
      544,
      // Gambier Bay改
      396,
      // 瑞鳳改二乙
      560,
      // 神鷹
      534,
      // 神鷹改
      381,
      // 神鷹改二
      536,
    ].includes(mstId)
  )
  defineESType('AV', eq(t.AV))
  defineESType('CVLike', oneOf([t.CV,t.CVL,t.AV,t.CVB]))
  defineESType('BBV', eq(t.BBV))
  defineESType('DDorDE', oneOf([t.DD,t.DE]))

  return [$isESType, $allESTypes]
})()

const shortDesc = estypeName =>
  estypeName === "CVLike" ? "CV*" :
  estypeName === "SSLike" ? "SS*" :
  estypeName === "DDorDE" ? "DD/DE" :
  estypeName

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
  allCVEIdsSelector,
}
