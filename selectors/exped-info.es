import _ from 'lodash'
import { createSelector } from 'reselect'
import { join } from 'path-extra'
import { readJsonSync } from 'fs-extra'
import { projectorToComparator } from 'subtender'

import {
  constSelector,
} from 'views/utils/selectors'

import { debug } from '../debug'

/*
   exped-extra-info stores some extra information for expeditions:

   - keys are guaranteed to be expedition numbers
     (can be safely converted back to integers)

   - values are Objects of extra info, for now the only property is
     "resources", which is an Array of exactly 4 elements that represents
     fuel, ammo, steel and bauxite respectively.

 */
const rawExpedExtraInfo =
  readJsonSync(join(__dirname, '..', 'assets', 'exped-extra-info.json'))

const toPercent = x => Math.round(100 * x)

const itemIdToName = x =>
  x === 1 ? 'Bucket' :
  x === 2 ? 'Flamethrower' :
  x === 3 ? 'DevMat' :
  x === 10 ? 'FCoinSmall' :
  x === 11 ? 'FCoinMedium' :
  x === 12 ? 'FCoinLarge' :
  debug.error(`unknown item id: ${x}`)

const mkItem = itemData => itemData[0] === 0 ?
  null :
  {
    itemId: itemIdToName(itemData[0]),
    itemMaxCount: itemData[1],
  }

const rawExpedInfoSelector = createSelector(
  constSelector,
  ({$missions}) => $missions
)

/*
   produces an Array of all expeditions groupped by world number.
   every element of the Array is [<World number>, <Array of expedition id>]
 */
const grouppedExpedIdsSelector = createSelector(
  rawExpedInfoSelector,
  raw =>
    _.toPairs(
      _.mapValues(
        _.groupBy(raw,'api_maparea_id'),
        xs => xs.map(x => x.api_id)
      )
    ).map(
      ([kS,v]) => [Number(kS),v]
    ).sort(
      projectorToComparator(([k,_v]) => k)
    )
)

const expedInfoTableSelector = createSelector(
  rawExpedInfoSelector,
  $missions =>
    _.fromPairs(
      _.toPairs($missions).map(([expedIdStr, masterRaw]) => {
        const id = Number(expedIdStr)

        let resources = null
        const rawExtra = rawExpedExtraInfo[expedIdStr]
        if (rawExtra && Array.isArray(rawExtra.resources)) {
          const {resources: [fuel, ammo, steel, bauxite]} = rawExtra
          resources = {fuel, ammo, steel, bauxite}
        }

        const info = {
          id,
          /*
             technically things like "A1" are not numbers,
             but let's just pretend they are so as to keep terms
             consistent with game.
           */
          displayNum: masterRaw.api_disp_no,
          name: masterRaw.api_name,
          timeInMin: masterRaw.api_time,
          cost: {
            fuelPercent: toPercent(masterRaw.api_use_fuel),
            ammoPercent: toPercent(masterRaw.api_use_bull),
          },
          resources,
          itemNormal: mkItem(masterRaw.api_win_item1),
          itemGreatSuccess: mkItem(masterRaw.api_win_item2),
        }
        return [id, info]
      })
    )
)

const getExpedInfoFuncSelector = createSelector(
  expedInfoTableSelector,
  expedInfoTable =>
    id => expedInfoTable[id] || null
)

const expedNameToIdFuncSelector = createSelector(
  rawExpedInfoSelector,
  $missions => {
    const reverseLookupTable = _.fromPairs(
      _.toPairs($missions).map(([expedIdStr, raw]) =>
        [raw.api_name, Number(expedIdStr)])
    )
    return name => reverseLookupTable[name] || null
  }
)

export {
  expedInfoTableSelector,
  getExpedInfoFuncSelector,
  expedNameToIdFuncSelector,
  grouppedExpedIdsSelector,
}
