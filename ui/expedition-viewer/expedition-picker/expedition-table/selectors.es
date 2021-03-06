import _ from 'lodash'
import { createSelector } from 'reselect'
import { enumFromTo } from 'subtender'

import {
  fleetsSelector,
} from 'views/utils/selectors'

import {
  expedReqsStage2Selector,
  mkFleetInfoSelector,
  extraSelector,
} from '../../../../selectors'

import { EReq } from '../../../../structs/ereq'
import { mapExpedReq } from '../../../../exped-reqs'

const emptyNormGsFlags =
  _.fromPairs(enumFromTo(1,40).map(eId =>
    [eId, {norm: false, gs: false}]))

const mkEReqNormGsFlagsSelectorForFleet = _.memoize(
  fleetId => createSelector(
    mkFleetInfoSelector(fleetId),
    extraSelector,
    expedReqsStage2Selector,
    (fleet,extra,expedReqsStage2) => {
      if (fleet === null)
        return emptyNormGsFlags
      const isSat = x => x.result.sat === true
      return _.mapValues(
        expedReqsStage2,
        _.flow([
          expedReqStage2 => mapExpedReq(
            EReq.computeResult(fleet,extra)
          )(expedReqStage2),
          obj => ({
            norm: obj.norm.every(isSat),
            gs: obj.gs.every(isSat),
          }),
        ])
      )
    }
  )
)

const currentRunningExpedIdToFleetIdSelector = createSelector(
  fleetsSelector,
  fleets => _.fromPairs(fleets.map(fleetData => [
    _.get(fleetData,['api_mission',1]),
    _.get(fleetData,'api_id'),
  ]).filter(([expedId,fleetId]) =>
    _.isInteger(expedId) && expedId >= 1 && expedId <= 40 &&
    _.isInteger(fleetId) && fleetId >= 1 && fleetId <= 4))
)

export {
  mkEReqNormGsFlagsSelectorForFleet,
  currentRunningExpedIdToFleetIdSelector,
}
