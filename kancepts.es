import _ from 'lodash'

const urlGitHub = 'https://javran.github.io/kancepts/'
const urlKcWiki = 'https://box.kcwiki.org/kancepts/'

const getActualUrl = kanceptsUrl =>
  kanceptsUrl === 'github' ? urlGitHub :
  kanceptsUrl === 'kcwiki' ? urlKcWiki :
  console.error(`invalid kanceptsUrl: ${kanceptsUrl}`)

const makeLink = kanceptsUrl => {
  const kanceptsAddr = getActualUrl(kanceptsUrl) || urlGitHub
  return exportShipList => {
    if (exportShipList) {
      const {getStore} = window
      const slVal = encodeURIComponent(
        _.flatMap(
          Object.values(getStore().info.ships),
          rawInfo =>
            rawInfo.api_locked === 1 ? [
              `${rawInfo.api_lv>99?'r':''}${rawInfo.api_ship_id}`,
            ] : []
        ).join(',')
      )
      return `${kanceptsAddr}?sl=${slVal}`
    } else {
      return kanceptsAddr
    }
  }
}

export {
  urlGitHub,
  urlKcWiki,
  getActualUrl,
  makeLink,
}
