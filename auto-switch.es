/*

   auto-switch related mechanism

   - auto-switch is an attempt of trying to switch between fleets automatically
     depending on user in-game actions, this minimizes user interaction while
     keeps the most related info on plugin panel

   - when changing fleet composition or equipments, auto-switch tries to focus
     on fleet that we are working on

   - when user switch to "expedition" page in game,
     we pick the first available one and focus on it

   - after a fleet is send, auto-switch further checks whether there are more fleets to
     send and switch focus to it.

   - when all fleets are sent, auto-switch moves back to first fleet
     (I admit there is not really a very good reason for doing this,
      but if all fleets are sent, we only have main fleet to play with,
      so let's focus on it)

 */

const _ = require('lodash')

// some heuristic to determine which fleet we are changing.
// returns a number: 0,1,2,3 to indicate the changing fleet
// otherwise "null" if there is no change or we cannot determine this
// note that here we don't need to pass "isFleetCombined", nor "hideMainFleet",
// as we are just dealing the list of fleets visible to use
// (main fleets become invisible to this plugin when "hideMainFleet" is set)
// also note that "curFleets" and "nextFleet" should be of the same length
const findChangingFleet = (curFleets, nextFleets) => {
  // first of all, the fleet changing detection should only take into account
  // rosterId of ships and equipments, this avoids all problems dealing with
  // ship / equipment levelup.
  // and this also solves the problem mentioned in #2: first, it's impossible
  // to replace one equipment with itself. second, taking into account rosterIds
  // allows us to have a better picture of fleet statuses: it's not just one fleet,
  // but two fleets are changing, which is impossible to detect when only master id
  // is taken into account (we will mistakenly think it's only one changing fleet)

  // so the whole algorithm looks like so:
  // - first we transform both array of fleet representations,
  //   leaving only ships' roster ids and those of their equipments'
  // - count # of changing fleets (i.e. "changingCount")
  //   - changingCount === 0: no change at all
  //   - changingCount === 1: pick the changing one
  //   - changingCount > 1
  //     - now that multiple fleets are changing, the chances are
  //       - we are depriving an equipment from one fleet to another
  //       - we are applying a preset composition, which moves ships from
  //         other fleets to the current one we are working on.
  //         (despite that this one sounds reasonable, the current game mechanism
  //         does not allow you to "deprive" ships from another fleets to the current one,
  //         but it doesn't hurt taking this into account)
  //     - in this case we take the first "non-decreasing" fleet as the changing fleet.
  //       - "non-decreasing" means a fleet does not decrease in terms of # of ships,
  //         nor does it decrease in terms of # of equipments
  //       - we are intentionally not using the concept of "increasing",
  //         that does not detect swapping equipments nor depriving equipments.

  const transformFleetRep = fleet =>
    fleet.ships.map( ship => {
      const { rstId, equips } = ship
      const simpleEquips = equips.map(({rstId}) => ({rstId}))
      return { rstId, equips: simpleEquips }
    })

  // "simplifies" the array of fleet representation to show
  // only things the algorithm is interested in
  const curShips = curFleets.map(transformFleetRep)
  const nextShips = nextFleets.map(transformFleetRep)

  // one-by-one comparison, "sameFleet[i]" shows
  // whether "curShips[i]" and "nextShips[i]" are considered equal
  const sameFleet = curShips.map( (fleet,ind) => {
    const nextFleet = nextShips[ind]
    return _.isEqual(fleet,nextFleet)
  })

  const changingCount = sameFleet.filter(x => !x).length

  if (changingCount === 0)
    return null

  // at this point: changingCount > 0
  if (changingCount === 1) {
    for (let i=0; i<sameFleet.length; ++i)
      if (! sameFleet[i])
        return curFleets[i].index
  }

  // at this point: changingCount > 1
  const isNotDecreasing = (beforeFleet,afterFleet) => {
    if (beforeFleet.length !== afterFleet.length)
      return beforeFleet.length < afterFleet.length
    const eqListBefore = [].concat( ... beforeFleet.map(s => s.equips))
    const eqListAfter = [].concat( ... afterFleet.map(s => s.equips))
    return eqListBefore.length <= eqListAfter.length
  }

  // one or more fleets are updated
  // no matter how many fleet configurations have been changed,
  // we always pick those that appear different
  // and choose the first one that is "not-decreasing".
  // if we know:
  // - one fleet has somehow been changed
  // - the number of ships and the total number of equipments
  //   are not decreasing
  // then this is the changing fleet that we are looking for.
  for (let i=0; i<sameFleet.length;++i) {
    if (sameFleet[i])
      continue

    const fleet = curShips[i]
    const nextFleet = nextShips[i]
    if (isNotDecreasing(fleet,nextFleet)) {
      return curFleets[i].index
    }
  }

  return null
}

// finds next available fleet to send for expeditions
// returns `null` if all fleets are sent
// Note: main fleets are always skipped: they cannot be send to expeditions.
// because of this reason, we still need to check "beginFleetIndex"
// regardless of "hideMainFleet" setting
const findNextAvailableFleet = (fleetsExtra, isFleetCombined) => {
  const beginFleetIndex = !isFleetCombined ? 1 : 2
  for (let i=0; i<fleetsExtra.length; ++i) {
    const fleet = fleetsExtra[i]
    if (fleet.index < beginFleetIndex)
      continue
    if (fleet.available)
      return fleet.index
  }
  // move back to first fleet after all expeditions are sent
  // or do nothing at all if we are not supposed to keep track of main fleet
  return null
}

// detect whether we are sending a fleet
// see "Note" of "findNextAvailableFleet"
// also note that curFleets and nextFleets should be of the same length
const isSendingFleetToExped = (curFleets, nextFleets, isFleetCombined) => {
  // find a place "i" where an available fleet becoming unavailable next moment
  const beginFleetIndex = !isFleetCombined ? 1 : 2
  for (let i = 0; i<curFleets.length; ++i) {
    const curFleet = curFleets[i]
    if (curFleet.index < beginFleetIndex)
      continue

    const nextFleet = nextFleets[i]
    if (curFleet.available && !nextFleet.available)
      return true
  }
  return false
}

export {
  findChangingFleet,
  findNextAvailableFleet,
  isSendingFleetToExped,
}
