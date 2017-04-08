import { readJsonSync } from 'fs-extra'
import { join } from 'path-extra'

import { error } from './utils'

const expedInfoRaw = readJsonSync(join(__dirname, 'assets', 'exped-info.json'))

const expedInfo = (() => {
  const ret = new Array(40+1)

  expedInfoRaw.map( data => {
    const id = data.api_id
    const toPercent = x => Math.round(100 * x)
    const itemIdToName = x =>
        x === 1 ? "Bucket"
      : x === 2 ? "Flamethrower"
      : x === 3 ? "DevMat"
      : x === 10 ? "FCoinSmall"
      : x === 11 ? "FCoinMedium"
      : x === 12 ? "FCoinLarge"
      : error(`unknown item id: ${x}`)

    const mkItem = itemData =>
      itemData[0] === 0
        ? null
        : { itemId: itemIdToName(itemData[0]), itemMaxCount: itemData[1] }

    ret[id] = {
      id,
      name: data.api_name,
      timeInMin: data.api_time,
      cost: {
        fuelPercent: toPercent( data.api_use_fuel ),
        ammoPercent: toPercent( data.api_use_bull ),
      },
      resource: {
        fuel: data.resource[0],
        ammo: data.resource[1],
        steel: data.resource[2],
        bauxite: data.resource[3],
      },
      itemNormal: mkItem( data.api_win_item1 ),
      itemGreatSuccess: mkItem( data.api_win_item2 ),
    }
  })

  return ret
})()

const expedNameToId = expedName =>
  (expedInfo.find( e => e && e.name === expedName )
  || error(`unknown exped name: ${expedName}`)).id

export {
  expedInfo,
  expedNameToId,
}
