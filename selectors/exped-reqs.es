import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  selectedExpedsSelector,
  sparkledCountSelector,
} from './common'
import {
  mkFleetInfoSelector,
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
    return expedReqs.map(expedReq => {
      if (! expedReq)
        return expedReq
      return mapExpedReq(EReq.performStage2(config))(expedReq)
    })
  }))

const mkEReqResultObjectSelectorForFleet = _.memoize(
  fleetId => createSelector(
    selectedExpedsSelector,
    mkFleetInfoSelector(fleetId),
    expedReqsStage2Selector,
    (selectedExpeds,fleet,expedReqsStage2) => {
      const expedId = selectedExpeds[fleetId]
      const expedReqStage2 = expedReqsStage2[expedId]
      const ereqResultObj = mapExpedReq(
        EReq.computeResult(fleet)
      )(expedReqStage2)
      return ereqResultObj
    }))

export {
  expedReqsStage2Selector,
  mkEReqResultObjectSelectorForFleet,
}
