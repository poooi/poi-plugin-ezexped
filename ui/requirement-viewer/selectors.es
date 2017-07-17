import _ from 'lodash'
import { createSelector } from 'reselect'

import {
  selectedExpedsSelector,
  mkFleetInfoSelector,
} from '../../selectors'
import { mapExpedReq } from '../../exped-reqs'

import { expedReqsStage2Selector } from '../../selectors/exped-reqs'
import { EReq } from '../../structs/ereq'

const mkFleetEReqResultObjectSelector = fleetId => createSelector(
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
  })

export {
  mkFleetEReqResultObjectSelector,
}
