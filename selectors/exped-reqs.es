import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  sparkledCountSelector,
} from './common'
import {
  mkFleetInfoSelector,
  expedIdSelectorForFleet,
} from './fleet-info'
import { expedReqs, mapExpedReq } from '../exped-reqs'
import { EReq } from '../structs/ereq'

// extracts slice of interest related to expedition requirements
const minConfigSelector = sparkledCountSelector

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
    expedReqsStage2Selector,
    (expedId,fleet,expedReqsStage2) => {
      if (_.isEmpty(fleet))
        return null
      const expedReqStage2 = expedReqsStage2[expedId]
      const ereqResultObj = mapExpedReq(
        EReq.computeResult(fleet)
      )(expedReqStage2)
      return ereqResultObj
    }))

const mkEReqSatFlagsSelectorForFleet = _.memoize(
  fleetId => createSelector(
    mkEReqResultObjectSelectorForFleet(fleetId),
    ereqResultObj => {
      if (ereqResultObj === null)
        return null
      const {norm, gs, resupply} = ereqResultObj
      const isSat = x => x.result.sat === true
      return {
        normFlag: norm.every(isSat),
        gsFlag: gs.every(isSat),
        resupplyFlag: isSat(resupply),
      }
    }))

export {
  expedReqsStage2Selector,
  mkEReqResultObjectSelectorForFleet,
  mkEReqSatFlagsSelectorForFleet,
}
