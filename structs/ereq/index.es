/*

   EReq should destruct <EReq> structure and dispatch it
   to the actual impl accordingly, every EReq is implemented
   as a class with static methods, these methods should respect the following
   specification:

   - prepare(<EReq>)(<pState>)(Fleet,Extra) = Object

       curried in this way to allow pre-processing ahead of
       getting info about the fleet.

       returns an Object of the following shape:

       {
         // whether this requirement is satisfied
         sat: <boolean>,
         // no spec atm, just extra information necessary
         // to render both the requirements and results
         extra: <Object>,
       }

   - make(...args) = Object

     make EReq objects. the argument list should be following the document
     as close as possible

   - Fleet structure:

       {
         ships: array of <Ship>s,
       }

   - Extra structure:

       {
         // spare equipments are those not being used in any fleet.
         spareEquips: {
           // daihatsu landing craft
           '68': <number>,
           // toku daihatsu landing craft
           '193': <number>,
         }
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
import { FillDlc } from './fill-dlc'
import { TotalAsw } from './total-asw'
import { TotalAntiAir } from './total-anti-air'
import { TotalLos } from './total-los'
import { TotalFirepower } from './total-firepower'
import { MissingInfo } from './missing-info'

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
  FillDlc,
  TotalAsw,
  TotalAntiAir,
  TotalLos,
  TotalFirepower,
  MissingInfo,
].map(cls => [cls.name, cls]))

const allEReqTypes = Object.keys(classTable)

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
  static allTypes = allEReqTypes
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

  /*

   note that the `prepare` method above is a curried function
   that takes 3 parameters before yielding the final result:

   - ereq structure
   - pState structure
   - fleet structure

   if we partially apply a function depending on the availability
   of info, we can break things into some stages:

   - stage1: the stage after `ereq` itself is applied to prepare
   - stage2: the stage after `pState` is applied
   - result: the stage after `fleet` is applied, yielding the final result

   `performStage1` takes `ereq` structure and transforms it into a structure of

   {
     ereq: <Object>,
     stage1: <function>,
   }

   after this stage, applying arguments should keep attaching fields
   into this structure ('attaching' in functional sense),
   the meaning of them are:

   - ereq: raw object, serializable representation
   - stage1: result of EReq.prepare(ereq)
   - stage2: result of EReq.prepare(ereq)(pState)
   - result: return value of EReq.prepare(ereq)(pState)(fleet), serializable,
     for rendering on UIs

 */
  static performStage1 = ereq => {
    const stage1 = EReq.prepare(ereq)
    return {ereq, stage1}
  }

  static performStage2 = pState => obj => ({
    ...obj,
    stage2: obj.stage1(pState),
  })

  static computeResult = (fleet,extra) => obj => ({
    ...obj,
    result: obj.stage2(fleet,extra),
  })
}

export { EReq }
