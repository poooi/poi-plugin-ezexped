import { createSelector } from 'reselect'
import { extConfigSelector } from './common'
import { expedReqs, mapExpedReq } from '../exped-reqs'
import { EReq } from '../structs/ereq'

// extracts slice of interest related to expedition requirements
const minConfigSelector = createSelector(
  extConfigSelector,
  ({config}) => config.sparkledCount)

const expedReqsStage2Selector = createSelector(
  minConfigSelector,
  // TODO: this function can be memoized
  sparkledCount => {
    const config = {sparkledCount}
    return expedReqs.map(expedReq => {
      if (! expedReq)
        return expedReq

      return mapExpedReq(EReq.performStage2(config))(expedReq)
    })
  })

export {
  minConfigSelector,
  expedReqsStage2Selector,
}
