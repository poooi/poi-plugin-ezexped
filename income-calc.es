/*

   Resource income-related calculations:

   - Daihatsu-related landing craft calculation

     + (as of Apr 11, 2022) https://wikiwiki.jp/kancolle/%E8%A3%85%E5%82%99%E6%9C%80%E5%A4%A7%E5%80%A4/%E5%A4%A7%E7%99%BA%E7%B3%BB%E8%A3%85%E5%82%99%E6%97%A9%E8%A6%8B%E8%A1%A8/%E3%83%86%E3%83%BC%E3%83%96%E3%83%AB

     + Reference: (as of Mar 27, 2017)

       - wikia: http://kancolle.wikia.com/wiki/Expedition
       - wikiwiki: http://wikiwiki.jp/kancolle/?%C6%C3%C2%E7%C8%AF%C6%B0%C4%FA

       When there are inconsistencies between two sources (this happens when
       there are at least 3 Toku Daihatsus), wikiwiki source takes precedence
       as it seems to be more complete than the other
       (for the Toku Daihatsu-Normal Daihatsu interaction on caps)

   - Consumption regarding marriage

       Reference: (as of Mar 27, 2017)

       - wikiwiki: http://wikiwiki.jp/kancolle/?%A5%B1%A5%C3%A5%B3%A5%F3%A5%AB%A5%C3%A5%B3%A5%AB%A5%EA

 */


/*
  Reference: https://twitter.com/Ex_witch/status/797446805847822341
 */
const computeTokuBonus = (normalCount, tokuCount) => {
  if (tokuCount <= 2)
    return 0.02 * tokuCount
  if (tokuCount === 3) {
    return normalCount <= 1 ? 0.05 :
      normalCount === 2 ? 0.052 :
      /* normalCount > 2 */ 0.054
  }

  // tokuCount > 3
  return normalCount === 0 ? 0.054 :
    normalCount === 1 ? 0.056 :
    normalCount === 2 ? 0.058 :
    normalCount === 3 ? 0.059 :
    /* normalCount > 3 */ 0.06
}

/*

   returns a structure:

   { impLvlCount:
       improvement level count of daihatsu-class equipments
   , dhtCount:
       # of daihatsu-class equipments
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
  // Reference: wikiwiki (see comment in header)
  /*
    Basic bonus table (wikiwiki, as of Apr 11, 2022)

    - 大発動艇: 5%
    - 特大発動艇: 5%
    - 武装大発: 3%
    - 大発動艇(八九式中戦車＆陸戦隊): 2%
    - 装甲艇(AB艇): 2%
    - 大発動艇(II号戦車/北アフリカ仕様): 2%
    - 特大発動艇＋一式砲戦車: 2%
    - 特二式内火艇: 1%

   */

  let countBns05 = 0
  let countBns03 = 0
  let countBns02 = 0
  let countBns01 = 0

  let tokuCount = 0

  // number of special ships (only applicable to Kinu K2 for now)
  // that grant +5% income (before-cap)
  let spShipCount = 0
  let impLvlCount = 0

  // one pass to count them all!
  // um, we could do some "pure functional" stuff
  // but I'm sure that'll be awkward.
  fleet.map(ship => {
    if (ship.mstId === 487)
      ++spShipCount

    ship.equips.map(equip => {
      const countImp = () => {
        impLvlCount += equip.level
      }

      if ([
        // 大発動艇
        68,
        // 特大発動艇
        193,
      ].includes(equip.mstId)) {
        if (equip.mstId === 193) {
          ++tokuCount
        }
        ++countBns05
        countImp()
      } else if (
        // 武装大発
        equip.mstId === 409
      ) {
        ++countBns03
        countImp()
      } else if ([
        // 大発動艇(八九式中戦車＆陸戦隊)
        166,
        // 装甲艇(AB艇)
        408,
        // 大発動艇(II号戦車/北アフリカ仕様)
        436,
        // 特大発動艇＋一式砲戦車
        449,
      ].includes(equip.mstId)) {
        ++countBns02
        countImp()
      } else if (
        // 特二式内火艇
        equip.mstId === 167
      ) {
        ++countBns01
        countImp()
      }
    })
  })

  const dhtCount = countBns05 + countBns03 + countBns02 + countBns01
  const aveImp = dhtCount === 0 ? 0 : impLvlCount / dhtCount
  const b1BeforeCap =
    0.05 * (countBns05 + spShipCount) +
    0.03 * countBns03 +
    0.02 * countBns02 +
    0.01 * countBns01
  const b1 = Math.min(0.2, b1BeforeCap)
  const bStar = b1 * aveImp / 100

  /*
    Regarding source bonus, it isn't clear what should be considered as
    "大発" so here let's just be lazy and count all those that has non-zero bonus
    (which we have already counted) and exclude "特大発動艇" specifically.

    TODO: we could fix this by having access to $const to get category given equipId,
    which would require us to wire-in a selector.
   */
  const tokuBonus = computeTokuBonus(countBns05 - tokuCount, tokuCount)

  return {
    dhtCount,
    impLvlCount,
    normalBonus: b1,
    normalBonusStar: bStar,
    tokuBonus,
  }
}

// "shipResupplyCost(ship)(fuelCostFactor,ammoCostFactor)" returns a structure:
// { fuelCost: <fuel cost>, ammoCost: <ammo cost> }
// results are guaranteed to be properly rounded given that input does so as well.
const shipResupplyCost = ship => {
  // "after marriage modifier":
  // - if there's no consumption before marriage, no consumption applied after marriage either.
  // - consumption is applied with 0.85 and then floor is taken, with a minimum cost of 1
  const applyAfterMarriage =
    v => (v === 0) ? 0 : Math.max(1, Math.floor(v*0.85))
  const modifier = ship.level >= 100 ? applyAfterMarriage : (x => x)

  return (fuelCostFactor, ammoCostFactor) => {
    const fuelCost = Math.floor( ship.maxFuel * fuelCostFactor )
    const ammoCost = Math.floor( ship.maxAmmo * ammoCostFactor )
    return {
      fuelCost: modifier(fuelCost),
      ammoCost: modifier(ammoCost),
    }
  }
}

// "fleetResupplyCost(ship)(fuelCostFactor,ammoCostFactor)"
// is the same as "shipResupplyCost"
// but for an array of ship representation
const fleetResupplyCost = fleet => {
  const ks = fleet.map( shipResupplyCost )
  const mergeCost = (x,y) => ({
    fuelCost: x.fuelCost + y.fuelCost,
    ammoCost: x.ammoCost + y.ammoCost,
  })
  return (fFactor,aFactor) =>
    ks.map(x => x(fFactor,aFactor))
      .reduce(mergeCost, {fuelCost: 0, ammoCost: 0})
}

const daihatsu = { computeBonus }

export {
  daihatsu,
  shipResupplyCost,
  fleetResupplyCost,
}
