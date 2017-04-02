import { createSelector } from 'reselect'
import { 
  fleetShipsDataSelectorFactory,
  fleetShipsEquipDataSelectorFactory,
  fleetSelectorFactory,
  extensionSelectorFactory,
} from 'views/utils/selectors'

// reorganize data, sharp it to form the basic input structure
// of other functions
const mkFleetInfo = fleetId => (shipsData, equipsData, fleetData) => {
  const ships = shipsData.map( ([shipInst, $ship], ind) => {
    const equips = equipsData[ind]
      .filter(x => x)
      .map( ([equipInst, $equip]) => ({
        mstId: $equip.api_id,
        level: equipInst.api_level,
      }))
    const [[curAmmo, maxAmmo], [curFuel,maxFuel]] =
      [[shipInst.api_bull, $ship.api_bull_max],
       [shipInst.api_fuel, $ship.api_fuel_max]]
    return {
      mstId: $ship.api_id,
      // roster ID of current ship
      rstId: shipInst.api_id,
      name: $ship.api_name,
      equips,
      level: shipInst.api_lv,
      morale: shipInst.api_cond,
      maxAmmo, maxFuel,
      needResupply: curAmmo !== maxAmmo || curFuel !== maxFuel,
      stype: $ship.api_stype,
    }
  })
  return { 
    name: fleetData.api_name,
    available: fleetData.api_mission[0] === 0,
    ships,
  }
}

// 0 <= fleetId <= 3
const mkFleetInfoSelector = fleetId =>
  createSelector(
    fleetShipsDataSelectorFactory(fleetId),
    fleetShipsEquipDataSelectorFactory(fleetId),
    fleetSelectorFactory(fleetId),
    store => store.sortie.combinedFlag,
    mkFleetInfo(fleetId))

const combinedFlagSelector = 
  store => store.sortie.combinedFlag

const reduxSelector =
  extensionSelectorFactory('poi-plugin-ezexped')

export {
  mkFleetInfoSelector,
  combinedFlagSelector,
  reduxSelector,
}
