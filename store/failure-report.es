import _ from 'lodash'
import { ensureDirSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'
import { debug } from '../debug'

const getFailureReportPath = () => {
  const { APPDATA_PATH } = window
  const frPath = join(APPDATA_PATH,'ezexped','failure-report')
  ensureDirSync(frPath)
  return frPath
}

const recordFailure = (apiResult, cqc, time) => {
  if (!time || !_.isInteger(time)) {
    debug.error(`invalid time ${time} upon recording`, apiResult, cqc)
    return
  }
  const failureReportPath = join(getFailureReportPath(), `${time}.json`)
  const record = {apiResult, cqc, time}
  writeJsonSync(failureReportPath,record)
}

export { recordFailure }
