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

const { _ } = window

// some heuristic to determine which fleet we are changing.
// returns a number: 0,1,2,3 to indicate the changing fleet
// otherwise "false" if there is no change or we cannot determine this
const findChangingFleet = (curFleetsFull, nextFleetsFull) => {
  // transform the whole array of fleet ship representation
  // so that we only test equality based on info that we are interested in

  // we use roster id instead of master id + level approach
  // otherwise even a levelup would trigger fleet focus change
  // upon returning
  const transformFleets = fleets => fleets.map( fleet => fleet.map(
    ({equips,rstId}) => ({equips,rstId}) ))

  const curFleets = transformFleets( curFleetsFull )
  const nextFleets = transformFleets( nextFleetsFull )

  // compare fleet one-by-one, and determine which one is the one
  // that we are operating:
  // if there's only one changing fleet, that should be it.
  // otherwise, if there is more than one changing fleet,
  // take the first one that "increases" somehow: either it has an increasing number
  // of ships or has an increasing number of equipments.
  const compared = curFleets.map( (fleet,ind) => {
    const nextFleet = nextFleets[ind]
    return _.isEqual(fleet,nextFleet)
  })

  const changingCount = compared.filter(x => !x).length

  // the detection was based on "increasing", which is less accurate (see issue #2)
  const isNotDecreasing = (beforeFleet,afterFleet) => {
    if (beforeFleet.length !== afterFleet.length)
      return beforeFleet.length < afterFleet.length
    const eqListBefore = [].concat( ... beforeFleet.map(s => s.equips))
    const eqListAfter = [].concat( ... afterFleet.map(s => s.equips))
    return eqListBefore.length <= eqListAfter.length
  }

  if (changingCount === 0)
    return false

  // changingCount >= 1
  // one or more fleets are updated
  // no matter how many fleet configurations have been changed,
  // we always pick those that appear different
  // and choose the first one that is "not-decreasing".
  // if we know:
  // - one fleet has somehow been changed
  // - the number of ships and the total number of equipments
  //   are not decreasing
  // then this is the changing fleet that we are looking for.
  for (let i=0; i<compared.length;++i) {
    if (compared[i])
      continue

    const fleet = curFleets[i]
    const nextFleet = nextFleets[i]
    if (isNotDecreasing(fleet,nextFleet))
      return fleet.index
  }

  return false
}

// finds next available fleet to send for expeditions
// returns 0 if all fleets are sent
const findNextAvailableFleet = (fleetsExtra, combinedFlag, hideMainFleet) => {
  const beginInd = combinedFlag === 0 ? 1 : 2
  for (let i=beginInd; i<fleetsExtra.length; ++i)
    if (fleetsExtra[i].available)
      return i
  // move back to first fleet after all expeditions are sent
  // or do nothing at all if we are not supposed to keep track of main fleet
  return hideMainFleet ? null : 0
}

// detect whether we are sending a fleet
const isSendingFleetToExped = (curFleetsExtra, nextFleetsExtra, combinedFlag) => {
  const curFleetsAva = curFleetsExtra.map( x => x.available )
  const nextFleetsAva = nextFleetsExtra.map( x => x.available )

  // find a place "i" where an available fleet becoming unavailable next moment
  const beginInd = combinedFlag === 0 ? 1 : 2
  for (let i = beginInd; i<curFleetsAva.length; ++i)
    if (curFleetsAva[i] && !nextFleetsAva[i])
      return true
  return false
}

export {
  findChangingFleet,
  findNextAvailableFleet,
  isSendingFleetToExped,
}
