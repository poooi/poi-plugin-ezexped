import _ from 'lodash'

import { latestVersion } from './common'
import { savePState } from './save'
import { migratePStateAndLoad } from './migrate'

/*
   updatePState updates p-state of at least 1.4.0 to the latest version

   - it also ensures that version number is removed from return value
   - null can use used as input, in which case null will be returned

*/
const updatePState = oldPState => {
  if (oldPState === null)
    return null

  let curPState = oldPState

  const stripVersion = ps => {
    const {$dataVersion: _ignored, ...pState} = ps
    return pState
  }

  // 1.4.0 => 1.5.0
  if ('configVer' in curPState) {
    if (curPState.configVer !== '1.4.0') {
      console.error(`version 1.4.0 is expected while getting ${curPState.configVer}`)
      return null
    }
    const {configVer: _ignored, ...ps} = curPState
    curPState = {
      ...ps,
      expedTableExpanded: false,
      $dataVersion: '1.5.0',
    }
  }

  if (curPState.$dataVersion === '1.5.0') {
    const newPState = {
      ...curPState,
      kanceptsUrl: 'github',
      $dataVersion: '1.6.0',
    }
    curPState = newPState
  }

  if (curPState.$dataVersion === '1.6.0') {
    /*
      Migrate from old formula, which should be 21% + {15% * # of sparkled ships}

      ref: https://kancolle.fandom.com/wiki/Expedition?oldid=734928
     */
    const {
      sparkledCount,
      ...newPState
    } = curPState

    const gsRateCustom =
      // although we allow integers but those are all possible numbers from UI.
      [3,4,5,6].includes(sparkledCount)
        ? _.min([100, 21 + 15 * sparkledCount])
        : 100

    curPState = {
      ...newPState,
      gsRateCustom,
      $dataVersion: '1.9.0',
    }
  }

  if (curPState.$dataVersion === latestVersion) {
    // schedule a save when it turns out to be a update.
    if (curPState !== oldPState) {
      setTimeout(() => savePState(curPState))
    }
    return stripVersion(curPState)
  } else {
    console.error('error while updating p-state to latest version')
    console.error('the half-way p-state is:', curPState)
    return null
  }
}

const loadPState = () => {
  const oldPState = migratePStateAndLoad()
  return updatePState(oldPState)
}

export {
  loadPState,
}
