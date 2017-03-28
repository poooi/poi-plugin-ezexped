/*

   Daihatsu-related landing craft calculation

   Reference: (as of Mar 27, 2017)

   - wikia: http://kancolle.wikia.com/wiki/Expedition
   - wikiwiki: http://wikiwiki.jp/kancolle/?%C6%C3%C2%E7%C8%AF%C6%B0%C4%FA

   When there are inconsistencies between two sources (this happens when
   there are at least 3 Toku Daihatsus), wikiwiki source takes precedence
   as it seems to be more complete than the other 
   (for the Toku Daihatsu-Normal Daihatsu interaction on caps)

 */

// reference: wikiwiki (see comment in header)
const computeTokuBonus = (normalCount, tokuCount) => {
  if (tokuCount <= 2)
    return 0.02 * tokuCount
  if (tokuCount === 3) {
    return normalCount <= 1 ? 0.05 
      : normalCount === 2 ? 0.052
      : /* normalCount > 2 */ 0.054
  }
  // tokuCount > 3
  return normalCount === 0 ? 0.054
    : normalCount === 1 ? 0.056
    : normalCount === 2 ? 0.058
    : normalCount === 3 ? 0.059
    : /* normalCount > 3 */ 0.06
}

/*

   returns a structure:

   { aveImp:
       average improvement level of daihatsu-class equipments
   , normalBonus: 
       bonus granted by all Daihatsu-class equipments and Kinu K2
       without taking into account improvements
       referred to as "B_1" by wikia
   , normalBonusStar:
       bouns granted by improvement levels and normalBonus,
       referred to as "B_star" by wikia
   , tokuBonus: 
       extra bonus factor granted by Toku Daihatsus.
       referred to as "B_2 + ?" part by wikia
       (however this part is computed according to wikiwiki
       because which seems to be more accurate)
   }

 */
const computeBonus = fleet => {
  let normalCount = 0
  let t89Count = 0
  let t2Count = 0
  let tokuCount = 0
  // number of special ships (only applicable to Kinu K2 for now)
  // that grant +5% income (before-cap)
  let spShipCount = 0
  let impLvlCount = 0

  // one pass to count them all!
  // um, we could do some "pure functional" stuff
  // but I'm sure that'll be awkward.
  fleet.map( ship => {
    if (ship.mstId === 487)
      ++spShipCount

    ship.equips.map( equip => {
      const countImp = () => {
        impLvlCount += equip.level
      }

      if (equip.mstId === 68) {
        ++ normalCount
        countImp()
      } else if (equip.mstId === 166) {
        ++ t89Count
        countImp()
      } else if (equip.mstId === 167) {
        ++ t2Count
        countImp()
      } else if (equip.mstId === 193) {
        ++ tokuCount
        countImp()
      }
    })
  })

  const dhtCount = normalCount + t89Count + t2Count + tokuCount
  const aveImp = dhtCount === 0 ? 0 : impLvlCount / dhtCount
  const b1BeforeCap = 
    0.05 * (normalCount + tokuCount + spShipCount) + 
    0.02 * t89Count + 0.01 * t2Count
  const b1 = Math.min(0.2, b1BeforeCap)
  const bStar = b1 * aveImp / 100

  return {
    aveImp,
    normalBonus: b1,
    normalBonusStar: bStar,
    tokuBonus: computeTokuBonus(normalCount,tokuCount),
  }
}

export { computeBonus }
