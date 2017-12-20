import { writeJsonSync } from 'fs-extra'
import { getPStateFilePath, latestVersion } from './common'

const savePState = (pState, fillVersion = true) => {
  try {
    const pStateWithVer =
      fillVersion ? {
        ...pState,
        $dataVersion: latestVersion,
      } : pState

    writeJsonSync(getPStateFilePath(),pStateWithVer)
  } catch (err) {
    console.error('Error while writing to p-state file', err)
  }
}

export { savePState }
