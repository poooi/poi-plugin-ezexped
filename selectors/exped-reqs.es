import { createSelector } from 'reselect'
import { extConfigSelector } from './common'
import { expedReqs, mapExpedReq } from '../exped-reqs'

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

      return mapExpedReq(
        obj => ({
          ...obj,
          stage2: obj.stage1(config),
        })
      )(expedReq)
    })
  })

export {
  minConfigSelector,
  expedReqsStage2Selector,
}
