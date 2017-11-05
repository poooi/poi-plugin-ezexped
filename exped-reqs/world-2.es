import { fslSc, mk, escortSpecialFleetCompos } from './common'

const defineWorld2 = defineExped => {
  defineExped(9)(
    [
      ...fslSc(3,4),
      escortSpecialFleetCompos,
    ])

  defineExped(10)(
    [
      ...fslSc(3,3),
      mk.FleetCompo({CL: 2}),
    ])

  defineExped(11)(
    [
      ...fslSc(6,4),
      mk.FleetCompo({DD: 2}),
    ])

  defineExped(12)(
    [
      ...fslSc(4,4),
      mk.FleetCompo({DD: 2}),
    ])

  defineExped(13)(
    [
      ...fslSc(5,6),
      mk.FleetCompo({CL: 1, DD: 4}),
    ])

  defineExped(14)(
    [
      ...fslSc(6,6),
      mk.FleetCompo({CL: 1, DD: 3}),
    ])

  defineExped(15)(
    [
      ...fslSc(9,6),
      mk.FleetCompo({CVLike: 2, DD: 2}),
    ])

  defineExped(16)(
    [
      ...fslSc(11,6),
      mk.FleetCompo({CL: 1, DD: 2}),
    ])

  // reference: http://wikiwiki.jp/kancolle/?%B1%F3%C0%AC
  defineExped(110)(
    [
      ...fslSc(40,6),
      mk.LevelSum(150),
      mk.FleetCompo({AV: 1, CL: 1, DDorDE: 2}),
      mk.TotalAsw(200,true),
      mk.TotalAntiAir(200),
      mk.TotalLos(140),
      // TODO: I got reports that fleet meeting requirements above are still failing
      // so perhaps we need to wait for a while
      mk.MissingInfo(),
    ])
}

export { defineWorld2 }
