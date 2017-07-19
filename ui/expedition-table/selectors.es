import _ from 'lodash'
import { createSelector } from 'reselect'

import {
  fleetsSelector
} from 'views/utils/selectors'

import {
  expedReqsStage2Selector,
  mkFleetInfoSelector,
} from '../../selectors'
import { enumFromTo, testSelector } from '../../utils'
import { EReq } from '../../structs/ereq'
import { mapExpedReq } from '../../exped-reqs'

const emptyNormFlags = _.fromPairs(enumFromTo(1,40).map(eId => [eId, false]))

const mkEReqNormFlagsSelectorForFleet = _.memoize(
  fleetId => createSelector(
    mkFleetInfoSelector(fleetId),
    expedReqsStage2Selector,
    (fleet,expedReqsStage2) => {
      if (fleet === null)
        return emptyNormFlags
      const isSat = x => x.result.sat === true
      return _.mapValues(
        expedReqsStage2,
        _.flow([
          expedReqStage2 => mapExpedReq(
            EReq.computeResult(fleet)
          )(expedReqStage2),
          obj => obj.norm.every(isSat),
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
  mkEReqNormFlagsSelectorForFleet,
  currentRunningExpedIdToFleetIdSelector,
}
