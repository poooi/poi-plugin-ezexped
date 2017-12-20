import _ from 'lodash'
import {
  onFleetShips,
  requireGreaterOrEqual,
} from './common'

class TotalAsw {
  /*
     when noRecon = true, stats from some recon planes should be ignored,

     reference: http://wikiwiki.jp/kancolle/?%B1%F3%C0%AC

     for exped B1: "但し水偵・水爆・飛行艇の対潜値は無効" (as of Oct 29, 2017)
   */
  static make = (asw, noRecon=false) => ({asw, noRecon})

  static prepare = ({asw, noRecon}) => () =>
    onFleetShips(ships => {
      const totalAsw = _.sum(ships.map(x => x.asw))
      if (noRecon) {
        const totalAswRecon = _.sum(
          _.flatMap(
            ships,
            s =>
              _.flatMap(
                s.equips,
                e => e.isRecon ? [e.asw] : []
              )
          )
        )

        const effectAsw = totalAsw - totalAswRecon
        const effectAswText = `${effectAsw} = ${totalAsw}-${totalAswRecon}`
        const {sat,extra} = requireGreaterOrEqual(
          effectAsw,
          asw,
          // show tooltip regardless of sat
          true,
        )

        return {sat, extra: {...extra, left: effectAswText}}
      } else {
        return requireGreaterOrEqual(
          totalAsw,
          asw,
          // show tooltip regardless of sat
          true,
        )
      }
    })
}

export { TotalAsw }
