/*
   
   Expedition Requirement
   
 */

import * as et from './estype'

// expedition id => array of requirements
// const expedRequirements = new Array(40+1)

// every Requirement has two fields:
// checkFleet: Fleet -> Bool
// renderStr: any -> String
const Req = {}

const onNonEmpty = callback => fleet =>
  fleet.length > 0 && callback(fleet)

Req.fsLevel = lvl => ({
  checkFleet: onNonEmpty( fleet => fleet[0].level >= lvl ),
  renderStr: () => "Flagship Level: " + lvl,
})

Req.fsType = etypeName => ({
  checkFleet: onNonEmpty( fleet => 
    et.isESType[etypeName](fleet[0].stype)),
  renderStr: () => "Flagship Type: " + etypeName,
})

Req.shipCount = count => ({
  checkFleet: fleet => fleet.length >= count,
  renderStr: () => "Ship Count: " + count,
})

// equip -> bool
const isDrum = equip => equip.mstId === 75

// array of number -> number
const sum = arr => arr.reduce((x,y) => x+y, 0)

Req.drumCarrierCount = count => ({
  checkFleet: fleet =>
    fleet.filter( ship => 
      ship.equips.some( isDrum )).length >= count,
  renderStr: () => "Drum Carrier Count: " + count,
})

Req.drumCount = count => ({
  checkFleet: fleet =>
    sum(fleet.map( ship => ship.equips.filter( isDrum ).length )) >= count,
  renderStr: () => "Drum Count: " + count,
})

Req.levelSum = lvlSum => ({
  checkFleet: fleet =>
    sum(fleet.map( ship => ship.level )) >= lvlSum,
  renderStr: () => "Level Sum: " + lvlSum,
})

Req.sparkledCount = count => ({
  checkFleet: fleet =>
    fleet.filter( ship => ship.morale >= 50 ).length >= count,
  renderStr: () => "Sparkled Ships: " + count,
})

Req.shipTypeCount = (count, etName) => ({
  checkFleet: fleet =>
    fleet.filter( ship =>  et.isESType[etName](ship.stype) ).length >= count,
  renderStr: () => "Ship Type: " + etName + " with count " + count,
})

// TODO: not sure...
Req.morale = {
  checkFleet: fleet => fleet.every( ship => ship.morale >= 40 ),
  renderStr: () => "Morale",
}

Req.resupply = {
  checkFleet: fleet => fleet.every( ship => ! ship.needResupply ),
  renderStr: () => "Resupply",
}

// check a nested structure of requirements against a single fleet
// a requirement object is recognized by testing whether "checkFleet" exists
const checkAllReq = obj => fleet => {
  if (Array.isArray( obj ))
    return obj.map( x => checkAllReq(x)(fleet) )

  if (obj.checkFleet)
    return obj.checkFleet(fleet)

  const ret = {}
  for (const k in obj)
    ret[k] = checkAllReq(obj[k])(fleet)
  return ret
}

const collectUnmetReqs = (obj,result) => {
  if (Array.isArray( obj ))
    return [].concat(
      ...obj.map( (x,ind) => collectUnmetReqs(x,result[ind]) ))

  if (obj.checkFleet) {
    return result ? [] : [obj]
  }

  const ret = []
  for (const k in obj)
    ret.push( collectUnmetReqs(obj[k],result[k]) )
  return [].concat(... ret)
}

const mkSTypeReqs = function () {
  if (arguments.length % 2 === 1)
    throw "expecting even number of args"

  const ret = []
  for (let ind = 0; ind < arguments.length; ind += 2) {
    const count = arguments[ind]
    const etName = arguments[ind+1]
    if (! Number.isInteger( count ))
      throw `expecting an int on arg list (offset ${ind})`
    ret.push( Req.shipTypeCount(count,etName) )
  }
  return ret
}

const expedReqs = (() => {
  const ret = new Array(40+1)

  const basicReqs = [ Req.morale, Req.resupply ]
  const flagshipLevelAndShipCount = (fsl,sc) => 
    [Req.fsLevel(fsl), Req.shipCount(sc)]

  // world 1

  ret[1] = [
    ...flagshipLevelAndShipCount(1,2),
    ...basicReqs,
  ]

  ret[2] = [
    ...flagshipLevelAndShipCount(2,4),
    ...basicReqs,
  ]

  ret[3] = [
    ...flagshipLevelAndShipCount(3,3),
    ...basicReqs,
  ]

  ret[4] = [
    ...flagshipLevelAndShipCount(3,3),
    mkSTypeReqs(1,"CL", 2,"DD"),
    ...basicReqs,
  ]

  ret[5] = [
    ...flagshipLevelAndShipCount(3,4),
    mkSTypeReqs(1,"CL", 2,"DD"),
    ...basicReqs,
  ]

  ret[6] = [
    ...flagshipLevelAndShipCount(4,4),
    ...basicReqs,
  ]

  ret[7] = [
    ...flagshipLevelAndShipCount(5,6),
    ...basicReqs,
  ]

  ret[8] = [
    ...flagshipLevelAndShipCount(6,6),
    ...basicReqs,
  ]

  // world 2

  ret[9] = [
    ...flagshipLevelAndShipCount(3,4),
    mkSTypeReqs(1,"CL",2,"DD"),
    ...basicReqs,
  ]

  ret[10] = [
    ...flagshipLevelAndShipCount(3,3),
    mkSTypeReqs(2,"CL"),
    ...basicReqs,
  ]

  ret[11] = [
    ...flagshipLevelAndShipCount(6,4),
    mkSTypeReqs(2,"DD"),
    ...basicReqs,
  ]

  ret[12] = [
    ...flagshipLevelAndShipCount(4,4),
    mkSTypeReqs(2,"DD"),
    ...basicReqs,
  ]

  ret[13] = [
    ...flagshipLevelAndShipCount(5,6),
    mkSTypeReqs(1,"CL",4,"DD"),
    ...basicReqs,
  ]

  ret[14] = [
    ...flagshipLevelAndShipCount(6,6),
    mkSTypeReqs(1,"CL",3,"DD"),
    ...basicReqs,
  ]

  ret[15] = [
    ...flagshipLevelAndShipCount(9,6),
    mkSTypeReqs(2,"CVLike",2,"DD"),
    ...basicReqs,
  ]

  ret[16] = [
    ...flagshipLevelAndShipCount(11,6),
    mkSTypeReqs(1,"CL",2,"DD"),
    ...basicReqs,
  ]

  // world 3

  ret[17] = [
    ...flagshipLevelAndShipCount(20,6),
    mkSTypeReqs(1,"CL",3,"DD"),
    ...basicReqs,
  ]

  ret[18] = [
    ...flagshipLevelAndShipCount(15,6),
    mkSTypeReqs(3,"CVLike",2,"DD"),
    ...basicReqs,
  ]

  ret[19] = [
    ...flagshipLevelAndShipCount(20,6),
    mkSTypeReqs(2,"BBV",2,"DD"),
    ...basicReqs,
  ]

  ret[20] = [
    ...flagshipLevelAndShipCount(1,2),
    mkSTypeReqs(1,"SSLike",1,"CL"),
    ...basicReqs,
  ]

  ret[21] = [
    ...flagshipLevelAndShipCount(15,5),
    Req.levelSum(30),
    mkSTypeReqs(1,"CL",4,"DD"),
    Req.drumCarrierCount(3),
    ...basicReqs,
  ]

  ret[22] = [
    ...flagshipLevelAndShipCount(30,6),
    Req.levelSum(45),
    mkSTypeReqs(1,"CA",1,"CL",2,"DD"),
    ...basicReqs,
  ]

  ret[23] = [
    ...flagshipLevelAndShipCount(50,6),
    Req.levelSum(200),
    mkSTypeReqs(2,"BBV",2,"DD"),
    ...basicReqs,
  ]

  ret[24] = [
    ...flagshipLevelAndShipCount(50,6),
    Req.levelSum(200),
    mkSTypeReqs(1,"CL",4,"DD"),
    Req.fsType("CL"),
    ...basicReqs,
  ]

  // world 4

  ret[25] = [
    ...flagshipLevelAndShipCount(25,4),
    mkSTypeReqs(2,"CA",2,"DD"),
    ...basicReqs,
  ]

  ret[26] = [
    ...flagshipLevelAndShipCount(30,4),
    mkSTypeReqs(1,"CVLike",1,"CL",2,"DD"),
    ...basicReqs,
  ]

  ret[27] = [
    ...flagshipLevelAndShipCount(1,2),
    mkSTypeReqs(2,"SSLike"),
    ...basicReqs,
  ]

  ret[28] = [
    ...flagshipLevelAndShipCount(30,3),
    mkSTypeReqs(3,"SSLike"),
    ...basicReqs,
  ]

  ret[29] = [
    ...flagshipLevelAndShipCount(50,3),
    mkSTypeReqs(3,"SSLike"),
    ...basicReqs,
  ]

  ret[30] = [
    ...flagshipLevelAndShipCount(55,4),
    mkSTypeReqs(4,"SSLike"),
    ...basicReqs,
  ]

  ret[31] = [
    ...flagshipLevelAndShipCount(60,4),
    Req.levelSum(200),
    mkSTypeReqs(4,"SSLike"),
    ...basicReqs,
  ]

  ret[32] = [
    ...flagshipLevelAndShipCount(5,3),
    mkSTypeReqs(1,"CT",2,"DD"),
    Req.fsType("CT"),
    ...basicReqs,
  ]

  // world 5

  ret[33] = [
    ...flagshipLevelAndShipCount(1,2),
    mkSTypeReqs(2,"DD"),
    ...basicReqs,
  ]

  ret[34] = [
    ...flagshipLevelAndShipCount(1,2),
    mkSTypeReqs(2,"DD"),
    ...basicReqs,
  ]

  ret[35] = [
    ...flagshipLevelAndShipCount(40,6),
    mkSTypeReqs(2,"CVLike",1,"CA",1,"DD"),
    ...basicReqs,
  ]

  ret[36] = [
    ...flagshipLevelAndShipCount(30,6),
    mkSTypeReqs(2,"AV",1,"CL",1,"DD"),
    ...basicReqs,
  ]

  ret[37] = [
    ...flagshipLevelAndShipCount(50,6),
    Req.levelSum(200),
    mkSTypeReqs(1,"CL",5,"DD"),
    Req.drumCarrierCount(4),
    ...basicReqs,
  ]

  ret[38] = [
    ...flagshipLevelAndShipCount(65,6),
    Req.levelSum(240),
    mkSTypeReqs(5,"DD"),
    Req.drumCarrierCount(4),
    Req.drumCount(8),
    ...basicReqs,
  ]

  ret[39] = [
    ...flagshipLevelAndShipCount(3,5),
    Req.levelSum(180),
    mkSTypeReqs(1,"AS",4,"SSLike"),
    ...basicReqs,
  ]

  ret[40] = [
    ...flagshipLevelAndShipCount(25,6),
    Req.levelSum(150),
    mkSTypeReqs(1,"CL",2,"AV",2,"DD"),
    Req.fsType("CL"),
    ...basicReqs,
  ]
  
  return ret
})()

export { expedReqs, checkAllReq, collectUnmetReqs }
