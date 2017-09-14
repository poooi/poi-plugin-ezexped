import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  equipsSelector,
} from 'views/utils/selectors'

import {
  sparkledCountSelector,
} from './common'

import {
  mkFleetInfoSelector,
  expedIdSelectorForFleet,
  indexedFleetsInfoSelector,
} from './fleet-info'
import { expedReqs, mapExpedReq } from '../exped-reqs'
import { EReq } from '../structs/ereq'

// extracts slice of interest related to expedition requirements
const minConfigSelector = sparkledCountSelector

/*
  spare equipments are those not being used in any fleet.

  {
    // daihatsu landing craft
    '68': <number>,
    // toku daihatsu landing craft
    '193': <number>,
  }
*/

const spareEquipsSelector = createSelector(
  equipsSelector,
  indexedFleetsInfoSelector,
  (equips, indexedFleetsInfo) => {
    // rosterIds of all equipments from fleets
    const equipsInFleet = new Set(
      _.flatMap(
        _.compact(Object.values(indexedFleetsInfo)),
        fleetInfo =>
          _.flatMap(
            fleetInfo.ships,
            s => _.compact(s.equips.map(e => e.rstId))
          )
      )
    )
    const interestedEquips = Object.values(equips).filter(
      eq => [68,193].includes(eq.api_slotitem_id) &&
          !equipsInFleet.has(eq.api_id)
    )

    const spareEquipsMin = _.mapValues(
      _.groupBy(interestedEquips,'api_slotitem_id'),
      x => x.length
    )

    return {
      68: spareEquipsMin[68] || 0,
      193: spareEquipsMin[193] || 0,
    }
  }
)

const extraSelector = createSelector(
  spareEquipsSelector,
  spareEquips => ({spareEquips})
)

const expedReqsStage2Selector = createSelector(
  minConfigSelector,
  /*
     this function can be memoized because for now the only affecting
     config is just `sparkledCount` which is a number that takes
     only a few limited, comparable numbers
   */
  _.memoize(sparkledCount => {
    const config = {sparkledCount}
    return _.mapValues(
      expedReqs,
      mapExpedReq(EReq.performStage2(config))
    )
  }))

const mkEReqResultObjectSelectorForFleet = _.memoize(
  fleetId => createSelector(
    expedIdSelectorForFleet(fleetId),
    mkFleetInfoSelector(fleetId),
    extraSelector,
    expedReqsStage2Selector,
    (expedId,fleet,extra,expedReqsStage2) => {
      if (_.isEmpty(fleet))
        return null
      const expedReqStage2 = expedReqsStage2[expedId]
      const ereqResultObj = mapExpedReq(
        EReq.computeResult(fleet,extra)
      )(expedReqStage2)
      return ereqResultObj
    }))

const mkEReqSatFlagsSelectorForFleet = _.memoize(
  fleetId => createSelector(
    mkEReqResultObjectSelectorForFleet(fleetId),
    ereqResultObj => {
      if (ereqResultObj === null)
        return null
      const {norm, gs, resupply, dlc} = ereqResultObj
      const isSat = x => x.result.sat === true
      return {
        normFlag: norm.every(isSat),
        gsFlag: gs.every(isSat),
        resupplyFlag: isSat(resupply),
        dlcFlag: isSat(dlc),
      }
    }))

export {
  extraSelector,
  expedReqsStage2Selector,
  mkEReqResultObjectSelectorForFleet,
  mkEReqSatFlagsSelectorForFleet,
}
