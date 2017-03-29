const { _ } = window

// some heuristic to determine which fleet we are changing.
// returns a number: 0,1,2,3 to indicate the changing fleet
// otherwise "false" if there is no change or we cannot determine this
const findChangingFleet = (curFleets, nextFleets) => {
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
  
  const isIncreasing = (beforeFleet,afterFleet) => {
    if (beforeFleet.length !== afterFleet.length)
      return beforeFleet.length < afterFleet.length
    const eqListBefore = [].concat( ... beforeFleet.map(s => s.equips))
    const eqListAfter = [].concat( ... afterFleet.map(s => s.equips))
    return eqListBefore.length < eqListAfter.length
  }

  if (changingCount === 0)
    return false

  if (changingCount === 1)
    return compared.indexOf(false)
  
  // changingCount > 1

  // multiple fleets are updated
  for (let i=0; i<compared.length;++i) {
    if (compared[i])
      continue
      
    const fleet = curFleets[i]
    const nextFleet = nextFleets[i]
    if (isIncreasing(fleet,nextFleet))
      return i
  }

  return false
}

export {
  findChangingFleet,
}
