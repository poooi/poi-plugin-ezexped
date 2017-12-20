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

  const stripVersion = ps => {
    const {$dataVersion: _ignored, ...pState} = ps
    return pState
  }

  let curPState = oldPState

  if (
    ('$dataVersion' in curPState) &&
    curPState.$dataVersion === latestVersion
  ) {
    return stripVersion(curPState)
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

  if (
    ('$dataVersion' in curPState) &&
    curPState.$dataVersion === latestVersion
  ) {
    savePState(curPState)
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
