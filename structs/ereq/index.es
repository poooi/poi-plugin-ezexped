/*

   (TODO)
   EReq should destruct <EReq> structure and dispatch it
   to the actual impl accordingly, every EReq is implemented
   as a class with static methods, these methods should respect the following
   specification:

   - prepare(<EReq>)(<config>)(Fleet) = Object

       curried in this way to allow pre-processing ahead of
       getting info about the fleet.

       returns an Object of the following shape:

       {
         sat: <boolean>, // whether this requirement is satisfied
         tooltip: <Object> or null, // no spec atm, just stuff necessary to render a tooltip
       }

   - make(...args) = Object

     make EReq objects. the argument list should be following the document
     as close as possible

   - Fleet structure:

       {
         ships: array of <Ship>s,
       }

 */
import _ from 'lodash'

import { FSLevel } from './fs-level'
import { FSType } from './fs-type'
import { ShipCount } from './ship-count'
import { DrumCarrierCount } from './drum-carrier-count'
import { DrumCount } from './drum-count'
import { LevelSum } from './level-sum'
import { SparkledCount } from './sparkled-count'
import { SparkledCountCustom } from './sparkled-count-custom'
import { Morale } from './morale'
import { Resupply } from './resupply'
import { AllSparkled } from './all-sparkled'
import { FleetCompo } from './fleet-compo'
import { AnyFleetCompo } from './any-fleet-compo'

const classTable = _.fromPairs([
  FSLevel,
  FSType,
  ShipCount,
  DrumCarrierCount,
  DrumCount,
  LevelSum,
  SparkledCount,
  SparkledCountCustom,
  Morale,
  Resupply,
  AllSparkled,
  FleetCompo,
  AnyFleetCompo,
].map(cls => [cls.name, cls]))

const dispatchEReq = propName => ereq => {
  const {type} = ereq
  const cls = classTable[type]

  if (typeof cls !== 'undefined') {
    return cls[propName](ereq)
  } else {
    return console.error(`Failed to dispatch EReq: unknown type ${type}`)
  }
}

class EReq {
  /*

     EReq.make.<EReq type>(...args)
     examples:

     - EReq.make.FSLevel(10)
     - EReq.make.DrumCount(8)

   */
  static make = _.fromPairs(
    Object.entries(classTable).map(([clsName,cls]) => {
      const makeFunc = (...args) => {
        const obj = cls.make(...args)
        return {...obj, type: clsName}
      }
      return [clsName, makeFunc]
    }))

  static prepare = dispatchEReq('prepare')
}

export { EReq }
